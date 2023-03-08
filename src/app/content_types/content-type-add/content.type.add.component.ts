import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ContentType, FileExtension } from 'src/app/shared/models/content_type';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import { GridOptions, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-content-type-add',
  moduleId: module.id,
  templateUrl: 'content.type.add.component.html',
  styleUrls: ['content.type.add.component.css'],
})
export class ContentTypeAddComponent implements OnInit, OnDestroy {
  contentType: ContentType = {
    contentTypeId: undefined,
    contentTypeName: undefined,
    fileExtensions: [],
  };

  fileExtensionGridOptions: Partial<GridOptions<FileExtension>> = {
    columnDefs: [
      {
        field: 'fileExtensionName',
        headerName: 'صيغة الملف',
        editable: true,
        cellEditor: 'agTextCellEditor',
        cellEditorParams: {
          maxLength: 20,
        },
      },
      {
        headerName: '',
        colId: 'action',
        minWidth: 150,
        maxWidth: 150,
        cellRenderer: this.actionCellRenderer,
      },
    ],
    pagination: false,
    editType: 'fullRow',
    rowSelection: 'multiple',
    onCellClicked(params: any) {
      // Handle click event for action cells
      if (
        params.column.getColId() === 'action' &&
        params.event?.target?.dataset.action
      ) {
        let action = params.event.target.dataset.action;
        if (action === 'edit') {
          params.api.startEditingCell({
            rowIndex: params.node.rowIndex ?? 0,
            // gets the first columnKey
            colKey: params.columnApi.getDisplayedCenterColumns()[0].getColId(),
          });
        }

        if (action === 'update') {
          params.api.stopEditing(false);
        }

        if (action === 'cancel') {
          params.api.stopEditing(true);
        }
      }
    },
    onRowEditingStarted(params) {
      params.api.refreshCells({
        columns: ['action'],
        rowNodes: [params.node],
        force: true,
      });
    },
    onRowEditingStopped(params) {
      if (
        params.data?.fileExtensionName &&
        params.data?.fileExtensionName != ''
      ) {
        params.data.fileExtensionName =
          params.data?.fileExtensionName.toLowerCase();
        params.node.setData(params.data);
      }

      params.api.refreshCells({
        columns: ['action'],
        rowNodes: [params.node],
        force: true,
      });
    },
    rowData: [
      {
        contentTypeId: undefined,
        fileExtensionId: undefined,
        fileExtensionName: undefined,
        contentType: undefined,
      },
    ],
  };

  actionCellRenderer(params: ICellRendererParams) {
    let eGui = document.createElement('div');
    let editingCells = params.api.getEditingCells();
    // checks if the rowIndex matches in at least one of the editing cells
    let isCurrentRowEditing = editingCells.some((cell) => {
      return cell.rowIndex === params.node.rowIndex;
    });

    if (isCurrentRowEditing) {
      eGui.innerHTML = `
  <button type="button" class="btn btn-success action-button save"  data-action="update">   </button>
  <button type="button" class="btn btn-danger action-button cancel"  data-action="cancel" > </button>
  `;
    } else {
      eGui.innerHTML = `
  <button type="button" class="btn btn-primary action-button edit"  data-action="edit" >   </button>
  `;
    }
    return eGui;
  }

  contentTypeGetSub: Subscription | undefined;
  contentTypeCreateSub: Subscription | undefined;

  constructor(
    private bindGridService: BindGridService,
    private storageService: StorageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.fileExtensionGridOptions = this.bindGridService.modelIndex_bindGrid(
      this.fileExtensionGridOptions,
      false
    );
  }

  onAddFileExtension() {
    this.fileExtensionGridOptions.api?.applyTransaction({
      add: [
        {
          contentTypeId: undefined,
          fileExtensionId: undefined,
          fileExtensionName: undefined,
          contentType: undefined,
        },
      ],
    });
  }

  onDeleteFileExrensionRows(selectedRows: any[]) {
    this.fileExtensionGridOptions.api?.applyTransaction({
      remove: selectedRows,
    });
  }

  onCreateContentTypePOST() {
    this.contentTypeCreateSub = this.storageService
      .onCreateModelPOST('contentType', {
        ...this.contentType,
      })
      .subscribe({
        next: () => {
          this.location.back();
        },
      });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.getAllFileExtensionRows();
      this.onCreateContentTypePOST();
    }
  }

  getAllFileExtensionRows() {
    let rowData: FileExtension[] = [];
    this.fileExtensionGridOptions.api?.forEachNode((node) => {
      if (
        node.data &&
        node.data.fileExtensionName &&
        node.data.fileExtensionName != ''
      ) {
        rowData.push(node.data);
      }
    });
    this.contentType.fileExtensions = rowData;
    return rowData;
  }

  ngOnDestroy() {
    this.contentTypeGetSub?.unsubscribe();
    this.contentTypeCreateSub?.unsubscribe();
  }
}
