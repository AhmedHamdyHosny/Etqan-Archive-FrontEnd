import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileExtension } from 'src/app/shared/models/content_type';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';
import { ProjectFile } from 'src/app/shared/models/project_file';

export interface ProjectFileDialogData {
  projectFile: ProjectFile;
  references: {
    fileExtensions: FileExtension[];
    categories: CustomSelectListItem[];
  };
}

@Component({
  selector: 'app-project-file-add-dialog',
  moduleId: module.id,
  templateUrl: 'project.file.add.dialog.component.html',
  styleUrls: ['project.file.add.dialog.component.css'],
})
export class ProjectFileAddDialogComponent {
  fileKeyWords: { label: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProjectFileAddDialogComponent, ProjectFile>,
    @Inject(MAT_DIALOG_DATA)
    public data: ProjectFileDialogData
  ) {
    if (this.data.projectFile.keyWords) {
      this.fileKeyWords = this.data.projectFile.keyWords
        .split(',')
        .map((e: string) => {
          return { label: e };
        });
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.data.projectFile.keyWords = this.fileKeyWords
        .map((e) => e.label)
        .join(',');

      let selectedCatgory = this.data.references.categories.find(
        (x) => x.value == this.data.projectFile.categoryId
      );
      if(selectedCatgory){
        this.data.projectFile.category = {
          categoryId: selectedCatgory?.value,
          categoryName : selectedCatgory?.text,
        };
      }else{
        this.data.projectFile.category = undefined;
      }
      this.dialogRef.close(this.data.projectFile);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
