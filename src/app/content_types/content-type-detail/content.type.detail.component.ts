import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ContentType, FileExtension } from 'src/app/shared/models/content_type';
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';

@Component({
  selector: 'app-content-type-detail',
  moduleId: module.id,
  templateUrl: 'content.type.detail.component.html',
  styleUrls: ['content.type.detail.component.css'],
})
export class ContentTypeDetailComponent implements OnInit, OnDestroy {
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
        editable: false,
        // headerValueGetter: this.bindGridService.localizeHeader.bind(this),
      },
    ],
    pagination: false,
    rowSelection: 'multiple',
    rowData: [],
  };

  contentTypeId!: string;
  contentTypeGetSub: Subscription | undefined;

  constructor(
    private storageService: StorageService,
    private location: Location,
    private bindGridService: BindGridService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.contentTypeId = this.activatedRoute.snapshot.params['id'];
    this.onContentTypeGET();
    this.fileExtensionGridOptions = this.bindGridService.modelIndex_bindGrid(
      this.fileExtensionGridOptions,
      false
    );
  }

  onContentTypeGET(): void {
    this.contentTypeGetSub = this.storageService
      .onGetModelDetails('contentType', this.contentTypeId)
      .subscribe((data: any) => {
        this.contentType = data.result;
        this.fileExtensionGridOptions.api?.setRowData(
          this.contentType.fileExtensions
        );
      });
  }

  ngOnDestroy() {
    this.contentTypeGetSub?.unsubscribe();
  }

  onCancel() {
    this.location.back();
  }
}
