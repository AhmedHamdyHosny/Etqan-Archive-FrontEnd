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

  showMoreBtn : boolean = false;

  filterModel: {
    pageSize: number;
    pageNumber: number;
    projectId: string | undefined;
    contentTypeId: string | undefined;
    fileExtensionIds: string[];
    categoryId: string| undefined;
    keyWordsList: { label: string }[];
    keyWords: string;
  } = {
    pageSize: 20,
    pageNumber: 1,
    projectId: undefined,
    fileExtensionIds: [],
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
    this.getFiltersSub = this.projectFileService.getFilters().subscribe({
      next: (data: any) => {
        this.filterData = data.result;
      },
    });
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
    if (form.valid) {
      this.filterModel.keyWords = this.filterModel.keyWordsList
        .map((e) => e.label)
        .join(',');
      this.getProjectFiles(this.paging.page);
    }
  }

  getProjectFiles(page: number) {
    this.filterModel.pageNumber = page;
    this.getDataSub = this.projectFileService
      .getProjectFiles(this.filterModel)
      .subscribe({
        next: (data: any) => {
          this.paging.totalItemsCount = data.result.totalItemsCount;
          let pages = Math.ceil(this.paging.totalItemsCount / this.filterModel.pageSize);

          this.showMoreBtn = this.paging.page < pages ? true: false;
          this.projectFileViews = data.result.pageItems;
        },
      });
  }
  
  showMore(){
    this.paging.page++;
    this.getProjectFiles(this.paging.page);
  }

  ngOnDestroy(): void {
    this.getFiltersSub?.unsubscribe();
    this.getDataSub?.unsubscribe();
  }
}
