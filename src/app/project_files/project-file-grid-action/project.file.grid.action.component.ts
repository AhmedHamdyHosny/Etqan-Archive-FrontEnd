import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ProjectFileAddDialogComponent,
  ProjectFileDialogData,
} from '../project-file-add-dialog/project.file.add.dialog.component';
import { ProjectFile } from 'src/app/shared/models/project_file';
import { ICellRendererParams } from 'ag-grid-community';
import { FileExtension } from 'src/app/shared/models/content_type';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';
import { ProjectService } from 'src/app/project/project.service';
import { Subscription } from 'rxjs';
import { ProjectFileDetailDialogComponent } from '../project-file-detail-dialog/project.file.detail.dialog.component';

@Component({
  selector: 'app-project-file-grid-action',
  moduleId: module.id,
  templateUrl: 'project.file.grid.action.component.html',
  styleUrls: ['project.file.grid.action.component.css'],
})
export class ProjectFileGridActionComponent
  implements ICellRendererAngularComp, OnDestroy
{
  params!: ICellRendererParams;
  editBtn: boolean = false;
  detailBtn: boolean = false;

  projecFileDialogRef:
    | MatDialogRef<ProjectFileAddDialogComponent, ProjectFile>
    | undefined;

  references: {
    fileExtensions: FileExtension[];
    categories: CustomSelectListItem[];
  } = {
    categories: [],
    fileExtensions: [],
  };

  referencesSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private clipboard: Clipboard,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.referencesSubscription = this.projectService.referencesSub.subscribe(
      (data) => {
        this.references = data;
      }
    );

    if (this.params.context) {
      if (this.params.context.editBtn) {
        this.editBtn = true;
      }
      if (this.params.context.detailBtn) {
        this.detailBtn = true;
      }
    }
  }

  onDetail() {
    if (this.params.node.data) {
      this.dialog.open<ProjectFileDetailDialogComponent, ProjectFile>(
        ProjectFileDetailDialogComponent,
        {
          data: this.params.node.data,
        }
      );
    }
  }

  onEdit() {
    // this.router.navigate([
    //   'project-file',
    //   this.params.node.data.projectFileId,
    //   'edit',
    // ]);
    if (this.params.node.data) {
      this.projecFileDialogRef = this.dialog.open<
        ProjectFileAddDialogComponent,
        ProjectFileDialogData
      >(ProjectFileAddDialogComponent, {
        data: {
          projectFile: this.params.node.data,
          references: this.references,
        },
      });

      this.projecFileDialogRef?.afterClosed().subscribe((result) => {
        if (result != undefined) {
          this.params.node.setData(result);
        }
      });
    }
  }

  onCopyLink() {
    if (this.params.node.data?.filePath) {
      this.clipboard.copy(this.params.node.data.filePath);
      this.toastr.show('تم نسخ مسار الملف', undefined, {
        closeButton: true,
        timeOut: 2000,
      });
    } else {
      this.toastr.error('لا يوجد مسار للملف');
    }
  }

  refresh(): boolean {
    return false;
  }

  ngOnDestroy(): void {
    this.referencesSubscription?.unsubscribe();
  }
}
