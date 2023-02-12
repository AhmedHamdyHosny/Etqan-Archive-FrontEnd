import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderValueGetterParams } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community/dist/lib/entities/gridOptions';


@Injectable({ providedIn: 'root' })
export class BindGridService {
  constructor(public translate: TranslateService) {
  
  }

  public localizeHeader(parameters: HeaderValueGetterParams): string {
    // if (parameters.colDef?.headerName) {
    //   return this.translate.instant(parameters.colDef.headerName);
    // }
    return 'No headerName';
  }

  public modelIndex_bindGrid(
    gridOptions: GridOptions,
    isDetailGrid: boolean = false
  ): GridOptions {
    // this.gridoptions = gridOptions;
    let bindedGridOptions: GridOptions = {
      ...gridOptions,
      headerHeight: 40,
      columnDefs: gridOptions.columnDefs ? [
        {
          field: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          minWidth: 50,
          maxWidth: 50,
          filter: false,
          suppressNavigable: true,
        },
        ...gridOptions.columnDefs!,
      ]: null,
      defaultColDef: {
        ...gridOptions.defaultColDef,
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
        minWidth: 100,
      },
      paginationPageSize: 10,
      suppressRowClickSelection: true,
      suppressPaginationPanel: true,
      rowClassRules: {
        'odd-row-style': function (params: any) {
          return params.node.rowIndex % 2 !== 0;
        },
      },
    };
    if (isDetailGrid) {
      bindedGridOptions = {
        ...bindedGridOptions,
        columnDefs: [
          ...gridOptions.columnDefs!,
          {
            field: 'Actions',
            headerValueGetter: this.localizeHeader.bind(this),
            filter: false,
            sortable: false,
            cellRenderer: 'rowActionRenderer',
            minWidth: 130,
            maxWidth: 130,
            cellRendererParams: {},
          },
        ],
        context: {
          ...gridOptions.context,
          detailOnly: true,
        },
      };
    }
    bindedGridOptions = {
      ...bindedGridOptions,
      enableRtl: true,
    };
    return bindedGridOptions;
  }
}
