import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import { FilterItem, SortItems } from 'src/app/shared/models/generic_data_format';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CategoryGridActionComponent } from './category-grid-action/category.grid.action.component';

@Component({
  selector: 'app-category-grid',
  moduleId: module.id,
  templateUrl: 'category.grid.component.html',
  styleUrls: ['category.grid.component.css']
})
export class CategoryGridComponent implements OnInit, OnDestroy {
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
        field: 'categoryName',
        headerName: 'إسم الفئه',
        headerValueGetter: this.bindGridService.localizeHeader.bind(this),
        // minWidth: 130,
      },
      {
        field: 'Actions',
        headerName: '',
        filter: false,
        sortable: false,
        cellRenderer: 'categoryActionRenderer',
        minWidth: 170,
      },
    ],
    components: {
      categoryActionRenderer: CategoryGridActionComponent,
    },
    pagination: true,
    rowSelection: 'multiple',
  };

  ngOnInit(): void {
    this.categoryGetGridView(1);
    this.gridOptions = this.bindGridService.modelIndex_bindGrid(
      this.gridOptions,
      false
    );
  }

  onDeleteRows(selectedRows: any[]) {
    let selectedRowsId = selectedRows.map((val) => val.categoryId);
    this.deleteSub = this.storageService
      .onDeleteModel('category', selectedRowsId)
      .subscribe((data) => {
        this.gridOptions.api?.applyTransaction({ remove: selectedRows });
        this.storageService.gridLoader = false;
      });
  }

  onSortChanged(sorts: SortItems[]){
    this.gridSort = sorts;
    this.categoryGetGridView(1);
  }

  onFilterChanged(filters: FilterItem[]): void {
    this.gridFilters = filters;
    this.categoryGetGridView(1);
  }


  categoryGetGridView(page: number) {
    this.subscription = this.storageService
      .getGridView('category', {
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
    this.categoryGetGridView(page.pageIndex + 1);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }
}
