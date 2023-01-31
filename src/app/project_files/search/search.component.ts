import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProjectFileView } from 'src/app/shared/models/project_file';
import { ProjectFileService } from '../project_file.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  moduleId: module.id,
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  projectFileViews: ProjectFileView[] = [];
  getFiltersSub: Subscription | undefined;
  getDataSub: Subscription | undefined;

  filterData: {
    projects: CustomSelectListItem[];
    contentTypes: CustomSelectListItem[];
    categories: CustomSelectListItem[];
    fileExtensions: CustomSelectListItem[];
  } = {
    projects: [],
    contentTypes: [],
    categories: [],
    fileExtensions: [],
  };

  filterModel: {
    pageSize: number;
    pageNumber: number;
    projectId: string | undefined;
    contentTypeId: string | undefined;
    fileExtensionId: string | undefined;
    categoryId: string | undefined;
    keyWordsList: { label: string }[];
    keyWords: string;
  } = {
    pageSize: 20,
    pageNumber: 1,
    projectId: undefined,
    fileExtensionId: undefined,
    contentTypeId: undefined,
    categoryId: undefined,
    keyWordsList: [],
    keyWords: '',
  };

  paging = {
    totalItemsCount: 0,
    page: 1,
  };

  constructor(
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private router: Router,
    private projectFileService: ProjectFileService
  ) {}

  ngOnInit(): void {
    this.getFilterData(this.paging.page);
  }

  getFilterData(page: number) {
    this.filterModel.pageNumber = page;
    this.getFiltersSub = this.projectFileService.getFilters().subscribe({
      next: (data: any) => {
        this.filterData = data.result;
      },
    });
  }

  getProjectFiles() {
    this.getDataSub = this.projectFileService
      .getProjectFiles(this.filterModel)
      .subscribe({
        next: (data: any) => {
          this.paging.totalItemsCount = data.result.totalItemsCount;
          this.projectFileViews = data.result.pageItems;
        },
      });
  }

  onPageChanged(page: number) {
    this.getFilterData(page);
  }

  routeToFileDetail(item: ProjectFileView) {
    this.router.navigate(['project-file', item.projectFileId, 'detail']);
  }

  copyToClipboard(item: ProjectFileView) {
    if (item.filePath) {
      this.clipboard.copy(item.filePath ?? '');
      this.toastr.show('تم نسخ مسار الملف', undefined, {
        closeButton: true,
        timeOut: 2000,
      });
    } else {
      this.toastr.error('لا يوجد مسار للملف');
    }
  }

  onSubmit(form: NgForm) {
    this.filterModel.keyWords = this.filterModel.keyWordsList
      .map((e) => e.label)
      .join(',');
    this.getProjectFiles();
  }

  ngOnDestroy(): void {
    this.getFiltersSub?.unsubscribe();
    this.getDataSub?.unsubscribe();
  }
}
