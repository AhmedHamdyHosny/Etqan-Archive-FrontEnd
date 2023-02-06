import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { ProjectGridActionComponent } from 'src/app/project/project-grid/project-grid-action/project.grid.action.component';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import { FilterItem, SortItems } from 'src/app/shared/models/generic_data_format';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ProjectFileGridActionComponent } from '../project-file-grid-action/project.file.grid.action.component';

@Component({
  selector: 'app-project-file-grid',
  moduleId: module.id,
  templateUrl: 'project.file.grid.component.html',
  styleUrls: ['project.file.grid.component.css']
})
export class ProjectFileGridComponent implements OnInit, OnDestroy {
  subscription: Subscription | null = null;
  deleteSub: Subscription | null = null;
  gridFilters: FilterItem[] = [];
  
  gridSort: SortItems[] = [{ property: 'CreateDate', sortType: 'Desc', priority: 1 }];


  paging: {
    totalItems: number;
    pageSize: number ;
  } = {
    totalItems: 0,
    pageSize: 10,
  }

  constructor(
    private bindGridService: BindGridService,
    public translate: TranslateService,
    private storageService: StorageService
  ) {}



  gridOptions: Partial<GridOptions> = {
    columnDefs: [
      {
        field: 'projectName',
        headerName: 'المشروع',
        headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        // minWidth: 130,
      },
      {
        field: 'contentTypeName',
        headerName: 'نوع المحتوى',
        headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        // minWidth: 130,
      },
      {
        field: 'categoryName',
        headerName: 'فئة المحتوى',
        headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        // minWidth: 130,
      },
      {
        field: 'fileName',
        headerName: 'أسم الملف',
        headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        // minWidth: 130,
      },
      {
        field: 'fileExtensionName',
        headerName: 'صيغة الملف',
        headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        // minWidth: 130,
      },
      {
        field: 'Actions',
        headerName: '',
        // headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        filter: false,
        sortable: false,
        cellRenderer: 'projectFileActionRenderer',
        minWidth: 270,
      },
    ],
    components: {
      projectFileActionRenderer: ProjectFileGridActionComponent,
    },
    pagination: true,
    rowSelection: 'multiple',
    
  };

  ngOnInit(): void {
    this.projectFileGetGridView(1);
    this.gridOptions = this.bindGridService.modelIndex_bindGrid(
      this.gridOptions,
      false
    );
  }

  onDeleteRows(selectedRows: any[]) {
    let selectedRowsId = selectedRows.map((val) => val.projectFileId);
    this.deleteSub = this.storageService
      .onDeleteModel('projectFile', selectedRowsId)
      .subscribe((data) => {
        this.gridOptions.api?.applyTransaction({ remove: selectedRows });
        this.storageService.gridLoader = false;
      });
  }

  onSortChanged(sorts: SortItems[]){
    this.gridSort = sorts;
    this.projectFileGetGridView(1);
  }

  onFilterChanged(filters: FilterItem[]): void {
    this.gridFilters = filters;
    this.projectFileGetGridView(1);
  }


  projectFileGetGridView(page: number) {
    this.subscription = this.storageService
      .getGridView('projectFile', {
        sorts: this.gridSort,
        filters: this.gridFilters,
        paging: { pageNumber: page, pageSize: this.paging.pageSize },
      })
      .subscribe({
        next: (data: any) => {
          this.paging.totalItems = data.result.totalItemsCount;
          this.gridOptions.api?.setRowData(data.result.pageItems);
          this.storageService.gridLoader = false;
        },
        error: (error: any) => {
          this.storageService.gridLoader = false;
        },
      });
  }

  onPaginationChanged(page: PageEvent) {
    this.paging.pageSize = page.pageSize;
    this.projectFileGetGridView(page.pageIndex + 1);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }
}
