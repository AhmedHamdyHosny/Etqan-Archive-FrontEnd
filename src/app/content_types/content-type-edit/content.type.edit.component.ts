import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import { ContentType, FileExtension } from 'src/app/shared/models/content_type';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-type-edit',
  moduleId: module.id,
  templateUrl: 'content.type.edit.component.html',
  styleUrls: ['content.type.edit.component.css'],
})
export class ContentTypeEditComponent implements OnInit, OnDestroy {
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
      },
    ],
  };

  contentTypeId!: string;
  contentTypeGetSub: Subscription | undefined;
  contentTypeEditSub: Subscription | undefined;

  constructor(
    private bindGridService: BindGridService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.contentTypeId = this.activatedRoute.snapshot.params['id'];
    this.onEditContentTypeGET();
    this.fileExtensionGridOptions = this.bindGridService.modelIndex_bindGrid(
      this.fileExtensionGridOptions,
      false
    );
  }

  onEditContentTypeGET(): void {
    this.contentTypeGetSub = this.storageService
      .onEditModelGET('contentType', this.contentTypeId)
      .subscribe((data: any) => {
        this.contentType = data.result.item;
        this.fileExtensionGridOptions.api?.setRowData(
          this.contentType.fileExtensions
        );
      });
  }

  onAddFileExtension() {
    this.fileExtensionGridOptions.api?.applyTransaction({
      add: [
        {
          contentTypeId: undefined,
          fileExtensionId: undefined,
          fileExtensionName: undefined,
        },
      ],
    });
  }

  onDeleteFileExrensionRows(selectedRows: any[]) {
    this.fileExtensionGridOptions.api?.applyTransaction({
      remove: selectedRows,
    });
  }

  onEditContentTypePOST() {
    this.contentTypeEditSub = this.storageService
      .onEditModelPOST('contentType', this.contentTypeId, {
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
      console.log(this.contentType);
      this.onEditContentTypePOST();
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
  onCancel() {
    this.location.back();
  }

  ngOnDestroy() {
    this.contentTypeGetSub?.unsubscribe();
    this.contentTypeEditSub?.unsubscribe();
  }
}
