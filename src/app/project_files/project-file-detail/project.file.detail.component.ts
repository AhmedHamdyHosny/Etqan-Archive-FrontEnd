import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import {
  ProjectFile,
  ProjectFileView,
} from 'src/app/shared/models/project_file';

@Component({
  selector: 'app-project-file-detail',
  moduleId: module.id,
  templateUrl: 'project.file.detail.component.html',
  styleUrls: ['project.file.detail.component.css'],
})
export class ProjectFileDetailComponent implements OnInit, OnDestroy {
  projectFileId!: string;
  productionDate_str!: string;

  fileKeyWords: { label: string }[] = [];
  projectFile: ProjectFileView = {
    projectFileId: undefined,
    projectId: undefined,
    contentTypeId: undefined,
    fileExtensionId: undefined,
    categoryId: undefined,
    fileName: undefined,
    filePath: undefined,
    contentTitle: undefined,
    contentDescription: undefined,
    keyWords: undefined,
    productionDate: undefined,
    projectName: undefined,
    categoryName: undefined,
    contentTypeName: undefined,
    fileExtensionName: undefined,
    note: undefined,
  };

  projectFileGetSub: Subscription | undefined;

  constructor(
    private storageService: StorageService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectFileId = this.activatedRoute.snapshot.params['id'];
    this.onProjectFileGET();
  }

  onProjectFileGET(): void {
    this.projectFileGetSub = this.storageService
      .onGetModelDetails('projectFile', this.projectFileId)
      .subscribe((data: any) => {
        this.projectFile = data.result;
        if (this.projectFile.keyWords) {
          this.fileKeyWords = this.projectFile.keyWords
            .split(',')
            .map((e: string) => {
              return { label: e };
            });
        }
        let pipe = new DatePipe('en-US');
        this.productionDate_str =
          pipe.transform(this.projectFile.productionDate, 'dd/MM/yyyy') ?? '';
      });
  }

  ngOnDestroy() {
    this.projectFileGetSub?.unsubscribe();
  }

  onCancel() {
    this.location.back();
  }
}
