import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';
import { ProjectFile } from 'src/app/shared/models/project_file';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-file-add',
  moduleId: module.id,
  templateUrl: 'project.file.add.component.html',
  styleUrls: ['project.file.add.component.css'],
})
export class ProjectFileAddComponent implements OnInit, OnDestroy {
  projectFile: ProjectFile = {
    projectFileId: undefined,
    projectId: undefined,
    contentTypeId: undefined,
    fileExtensionId: undefined,
    categoryId: undefined,
    fileName: undefined,
    filePath: undefined,
    contentTitle: undefined,
    contentDescription: undefined,
    note: undefined,
    keyWords: undefined,
    productionDate: undefined,
  };
  fileKeyWords: {label: string}[] = [];

  references: {
    projects: CustomSelectListItem[];
    contentTypes: CustomSelectListItem[];
    categories: CustomSelectListItem[];
  } = {
    projects: [],
    contentTypes: [],
    categories: [],
  };

  projectFileGetSub: Subscription | undefined;
  projectFileCreateSub: Subscription | undefined;

  constructor(
    private storageService: StorageService,
    private location: Location,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.onCreateProjectFileGET();
  }

  onCreateProjectFileGET(): void {
    this.projectFileGetSub = this.storageService
      .onCreateModelGET('projectFile')
      .subscribe((data: any) => {
        this.references = data.result.references;
      });
  }

  onCreateProjectFilePOST() {
    let fileExtension: string|undefined;
    this.projectFile.keyWords = this.fileKeyWords.map(e => e.label).join(',');
    if(this.projectFile.filePath){
      let filePathArr = this.projectFile.filePath.split('\\');
      if(filePathArr.length == 1){
        filePathArr = this.projectFile.filePath.split('/');
      }
      if(filePathArr.length > 1){
        this.projectFile.fileName = filePathArr[filePathArr.length - 1];
        let fileName = this.projectFile.fileName.split('.');
        if(fileName.length > 1){
          fileExtension = fileName[fileName.length - 1];
        }else{
          this.toastr.error('مسار الملف المدخل خطأ');
          return;
        }
      }else{    
        this.toastr.error('مسار الملف المدخل خطأ');
        return;
      }
    }

    this.projectFileCreateSub = this.storageService
      .onCreateModelPOST('projectFile', {
        ...this.projectFile,
        fileExtensionName: fileExtension,
      })
      .subscribe({
        next: () => {
          this.location.back();
        },
      });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.onCreateProjectFilePOST();
    }
  }

  ngOnDestroy() {
    this.projectFileGetSub?.unsubscribe();
    this.projectFileCreateSub?.unsubscribe();
  }
}
