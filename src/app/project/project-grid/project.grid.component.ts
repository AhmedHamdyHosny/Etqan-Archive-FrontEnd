import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import {
  FilterItem,
  SortItems,
} from 'src/app/shared/models/generic_data_format';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ProjectGridActionComponent } from './project-grid-action/project.grid.action.component';

@Component({
  selector: 'app-project-grid',
  moduleId: module.id,
  templateUrl: 'project.grid.component.html',
  styleUrls: ['project.grid.component.css'],
})
export class ProjectGridComponent implements OnInit, OnDestroy {
  subscription: Subscription | null = null;
  deleteSub: Subscription | null = null;
  gridFilters: FilterItem[] = [];

  gridSort: SortItems[] = [
    { property: 'CreateDate', sortType: 'Desc', priority: 1 },
  ];

  paging: {
    totalItems: number;
    pageSize: number;
  } = {
    totalItems: 0,
    pageSize: 10,
  };

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
        minWidth: 130,
      },
      {
        field: 'projectLocation',
        headerName: 'الموقع',
        headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        minWidth: 130,
      },
      {
        field: 'Actions',
        headerName: '',
        // headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        filter: false,
        sortable: false,
        cellRenderer: 'projectActionRenderer',
        minWidth: 230,
        maxWidth: 230,
      },
    ],
    components: {
      projectActionRenderer: ProjectGridActionComponent,
    },
    pagination: true,
    rowSelection: 'multiple',
  };

  ngOnInit(): void {
    this.projectGetGridView(1);
    this.gridOptions = this.bindGridService.modelIndex_bindGrid(
      this.gridOptions,
      false
    );
  }

  onDeleteRows(selectedRows: any[]) {
    let selectedRowsId = selectedRows.map((val) => val.projectId);
    this.deleteSub = this.storageService
      .onDeleteModel('project', selectedRowsId)
      .subscribe((data) => {
        this.gridOptions.api?.applyTransaction({ remove: selectedRows });
        this.storageService.gridLoader = false;
      });
  }

  onSortChanged(sorts: SortItems[]) {
    this.gridSort = sorts;
    this.projectGetGridView(1);
  }

  onFilterChanged(filters: FilterItem[]): void {
    this.gridFilters = filters;
    this.projectGetGridView(1);
  }

  projectGetGridView(page: number) {
    this.subscription = this.storageService
      .getGridView('project', {
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
    this.projectGetGridView(page.pageIndex + 1);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }
}
