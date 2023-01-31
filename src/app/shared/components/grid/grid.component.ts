import {
  AfterViewChecked,
  AfterViewInit,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
// import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  Column,
  FilterChangedEvent,
  GridOptions,
  SortChangedEvent,
} from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';
import { FilterItem, SortItems } from '../../models/generic_data_format';
import { StorageService } from '../../services/storage.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  // translateSub: Subscription;
  @Output() gridAdd = new EventEmitter<any>();
  @Output() gridDelete = new EventEmitter<any>();
  @Output() gridReady = new Subject<any>();
  @Output() paginationChanged = new EventEmitter<PageEvent>();
  @Output() filterChanged = new Subject<FilterItem[]>();
  @Output() sortChanged = new Subject<SortItems[]>();

  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;

  @ViewChild('paginator')
  paginator: MatPaginator | undefined;

  constructor(
    public storageService: StorageService,
    // public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    // this.translateSub = this.translate.onLangChange.subscribe(
    //   (event: LangChangeEvent) => {
    //     if (this.gridOptions.api) {
    //       this.gridOptions.api.refreshHeader();
    //     }
    //   }
    // );
  }

  @Input() style = {
    height: '480px',
  };

  // @Input() detailGrid = false;
  @Input() actionsWithDialog = false;
  @Input() gridId: any;
  @Input() deleteBtn = true;
  @Input() AddBtn = true;

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;

  @Input() gridOptions: Partial<GridOptions> = {
    pagination: false,
  };

  dialogRef: MatDialogRef<DialogComponent> | undefined;

  @Input()
  showSelectedItemsNumber = false;
  NoSelectedItems = 0;

  ngOnInit(): void {
    // before bind
    // after bind
  }

  ngAfterViewInit(): void {
    // this.gridOptions.columnApi.autoSizeColumns(columnIds);
    this.gridOptions?.api?.sizeColumnsToFit();
  }

  onSortChanged(sortEvent: SortChangedEvent) {
    let sortModel: SortItems[] =
      sortEvent.columnApi
        .getAllColumns()
        ?.filter((column: Column) => {
          const field = column.getColDef().field;
          const sortState = column.getSort();
          if (field && sortState) {
            return true;
          }
          return false;
        })
        .map((column) => {
          const field = column.getColDef().field;
          const sortState = column.getSort();
          let sortValue: 'Asc' | 'Desc';
          switch (sortState) {
            case 'asc':
              sortValue = 'Asc';
              break;
            case 'desc':
              sortValue = 'Desc';
              break;
          }
          let sort: SortItems = {
            property: field!,
            sortType: sortValue!,
            priority: 1,
          };
          return sort;
        }) ?? [];
    this.sortChanged.next(sortModel);
  }

  onFilterChanged(filteEvent: FilterChangedEvent): void {
    let gridFilters: FilterItem[] = [];
    let filterModels: {
      [key: string]: any;
    } = filteEvent.api.getFilterModel();

    let keys = Object.keys(filterModels);

    if (keys.length != 0) {
      keys.forEach((key) => {
        let filter: {
          filter: any;
          filterType: string;
          type: string;
        } = filterModels[key];
        if (filter.filter != null && filter.filter != '') {
          gridFilters.push({
            property: key,
            value: filter.filter,
            operation: 'Like',
            logicalOperation: 'And',
          });
        }
      });
    }
    this.filterChanged.next(gridFilters);
  }

  onPaginationChanged(event: any) {
    this.paginationChanged.emit(event);
    if(this.pageSize != event.pageSize){
      this.pageSize = event.pageSize;
      this.agGrid?.api.paginationSetPageSize(event.pageSize);
    }
  }

  onSelectionChanged() {
    this.NoSelectedItems = this.gridOptions.api?.getSelectedRows().length ?? 0;
  }

  ngAfterViewChecked(): void {
    if (this.gridOptions.pagination) {
      const list: HTMLCollectionOf<Element> = document.getElementsByClassName(
        'mat-paginator-range-label'
      );
      setTimeout(
        () => {
          if (!this.paginator) return;
          let from = this.paginator.pageSize * this.paginator.pageIndex + 1;

          let to =
            this.paginator.length <
            this.paginator.pageSize * (this.paginator.pageIndex + 1)
              ? this.paginator.length
              : this.paginator.pageSize * (this.paginator.pageIndex + 1);

          let toFrom = this.paginator.length == 0 ? 0 : `${from} - ${to}`;
          let pageNumber =
            this.paginator.length == 0
              ? `0 of 0`
              : `${
                  this.paginator.pageIndex + 1
                } of ${this.paginator.getNumberOfPages()}`;
          let rows = `Page ${pageNumber} (${toFrom} of ${this.paginator.length})`;

          if (list.length >= 1) list[0].innerHTML = rows;
        },
        0,
        this.paginator?.pageIndex
      );
    }
  }

  onGridReady(params: any) {
    this.gridReady.next(params);
    params.api?.refreshCells();
  }

  onDeleteRow() {
    const selectedRows = this.gridOptions.api?.getSelectedRows() ?? [];
    if (selectedRows.length == 0) {
      this.dialog.open(DialogComponent, {
        data: {
          Header: 'انذار',
          Text: 'الرجاء تحديد عنصر واحد على الأقل',
          yesBtn: true,
          yesBtnValue: 'نعم',
        },
        autoFocus: false,
      });
      return;
    }
    this.showdiscardDialog();
    this.dialogRef?.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.gridDelete.emit(selectedRows);
      }
    });
  }

  showdiscardDialog() {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        Header: 'تأكيد',
        Text: 'هل أنت متأكد أنك تريد الحذف؟',
        yesBtnValue: 'أوافق',
      },
      autoFocus: false,
    });
  }

  onAddRow() {
    this.gridAdd.emit(this.gridOptions);
    if (!this.actionsWithDialog) {
      this.router.navigate(['../', 'add'], { relativeTo: this.activatedRoute });
    }
  }

  ngOnDestroy(): void {
    // this.translateSub?.unsubscribe();
  }
}
