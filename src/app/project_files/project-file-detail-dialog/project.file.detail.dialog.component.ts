import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectFile } from 'src/app/shared/models/project_file';
import {
  ProjectFileAddDialogComponent,
  ProjectFileDialogData,
} from '../project-file-add-dialog/project.file.add.dialog.component';

@Component({
  selector: 'app-project-file-detail-dialog',
  moduleId: module.id,
  templateUrl: 'project.file.detail.dialog.component.html',
  styleUrls: ['project.file.detail.dialog.component.css'],
})
export class ProjectFileDetailDialogComponent {
  fileKeyWords: { label: string }[] = [];
  productionDate_str: string | undefined;
  constructor(
    public dialogRef: MatDialogRef<ProjectFileAddDialogComponent, ProjectFile>,
    @Inject(MAT_DIALOG_DATA)
    public data: ProjectFile
  ) {
    if (this.data.keyWords) {
      this.fileKeyWords = this.data.keyWords.split(',').map((e: string) => {
        return { label: e };
      });
    }
    if (this.data.productionDate) {
      let pipe = new DatePipe('en-US');
      this.productionDate_str =
        pipe.transform(this.data.productionDate, 'dd/MM/yyyy') ?? '';
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
