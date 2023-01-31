import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectFile } from 'src/app/shared/models/project_file';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-file-edit',
  moduleId: module.id,
  templateUrl: 'project.file.edit.component.html',
  styleUrls: ['project.file.edit.component.css'],
})
export class ProjectFileEditComponent implements OnInit, OnDestroy {
  projectFileId!: string;
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
    productionDate: undefined
  };
  fileKeyWords: {label: string}[] = [];

  references: {
    projects: CustomSelectListItem[];
    contentTypes: CustomSelectListItem[];
     categories: CustomSelectListItem[];
  } = {
    projects: [
    ],
    contentTypes: [
    ],
    categories: [
    
    ],
  };

  projectFileGetSub: Subscription | undefined;
  projectFileEditSub: Subscription | undefined;

  constructor(
    private storageService: StorageService,
    private location: Location,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectFileId = this.activatedRoute.snapshot.params['id'];
    this.onEditProjectFileGET();
  }

  onEditProjectFileGET(): void {
    this.projectFileGetSub = this.storageService
      .onEditModelGET('projectFile', this.projectFileId)
      .subscribe((data: any) => {
        this.references = data.result.references;
        this.projectFile = data.result.item;
        if(this.projectFile.keyWords){
          this.fileKeyWords = this.projectFile.keyWords.split(',').map((e: string) => {
            return {label: e};
          });
        }
      });
  }

  onEditProjectFilePOST() {
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

    this.projectFileEditSub = this.storageService
      .onEditModelPOST('projectFile', this.projectFileId, {
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
      this.onEditProjectFilePOST();
    }
  }

  ngOnDestroy() {
    this.projectFileGetSub?.unsubscribe();
    this.projectFileEditSub?.unsubscribe();
  }

  
  onCancel() {
    this.location.back();
  }
}
