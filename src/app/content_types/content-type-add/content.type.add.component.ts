import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ContentType, FileExtension } from 'src/app/shared/models/content_type';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import { GridOptions } from 'ag-grid-community';

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
    // getRowStyle: (params) => {
    //   return params.node.isRowPinned() ? { 'font-weight': 'bold', 'font-style': 'italic' } : 0
    // },
    columnDefs: [
      {
        field: 'fileExtensionName',
        headerName: 'صيغة الملف',
        editable: true,
        // headerValueGetter: this.bindGridService.localizeHeader.bind(this),
      },
    ],
    pagination: false,
    rowSelection: 'multiple',
    onCellEditingStopped(event) {
      if (
        event.data?.fileExtensionName &&
        event.data?.fileExtensionName != ''
      ) {
        event.data.fileExtensionName =
          event.data?.fileExtensionName.toLowerCase();
        event.node.setData(event.data);
      }
    },
    rowData: [
      {
        contentTypeId: undefined,
        fileExtensionId: undefined,
        fileExtensionName: undefined,
        contentType: undefined
      },
    ],
  };

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
          contentType: undefined
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
      this.getAllFileExtensionRows()
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
