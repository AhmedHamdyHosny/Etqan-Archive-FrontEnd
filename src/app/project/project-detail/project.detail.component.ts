import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Project } from 'src/app/shared/models/project';
import { ProjectFileGridActionComponent } from 'src/app/project_files/project-file-grid-action/project.file.grid.action.component';
import { GridOptions } from 'ag-grid-community';
import { ProjectFile } from 'src/app/shared/models/project_file';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';

@Component({
  selector: 'app-project-detail',
  moduleId: module.id,
  templateUrl: 'project.detail.component.html',
  styleUrls: ['project.detail.component.css'],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project = {
    projectId: undefined,
    projectName: undefined,
    projectLocation: undefined,
    projectFiles: [],
  };
  projectFolderPath: string | undefined;

  projectFileGridOptions: Partial<GridOptions<ProjectFile>> = {
    columnDefs: [
      {
        field: 'fileName',
        headerName: 'إسم الملف',
      },
      {
        field: 'contentTypeName',
        headerName: 'نوع المحتوى',
        valueGetter: (param) =>
          param.node?.data?.fileExtension?.contentType?.contentTypeName,
        cellStyle: (params) => {
          if (!params.value || params.value == '') {
            //mark cell as red
            return { backgroundColor: '#D10000' };
          }
          return { backgroundColor: 'transparent' };
        },
      },
      {
        field: 'categoryName',
        valueGetter: (param) => param.node?.data?.category?.categoryName,
        headerName: 'فئه المحتوى',
        cellStyle: (params) => {
          if (!params.value || params.value == '') {
            //mark police cells as red
            return { backgroundColor: '#D10000' };
          }
          return { backgroundColor: 'transparent' };
        },
      },
      {
        field: 'Actions',
        headerName: '',
        filter: false,
        sortable: false,
        cellRenderer: 'projectFileGridActionRenderer',
        minWidth: 230,
        maxWidth: 230,
      },
    ],
    pagination: false,
    components: {
      projectFileGridActionRenderer: ProjectFileGridActionComponent,
    },
    context: {
      detailBtn: true,
    },
    rowSelection: 'multiple',
    rowData: [],
  };

  projectId!: string;
  projectGetSub: Subscription | undefined;

  constructor(
    private storageService: StorageService,
    private location: Location,
    private bindGridService: BindGridService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = this.activatedRoute.snapshot.params['id'];
    this.onProjectGET();
    this.projectFileGridOptions = this.bindGridService.modelIndex_bindGrid(
      this.projectFileGridOptions,
      false
    );
  }

  onProjectGET(): void {
    this.projectGetSub = this.storageService
      .onGetModelDetails('project', this.projectId)
      .subscribe((data: any) => {
        this.project = data.result;
        this.projectFileGridOptions.api?.setRowData(this.project.projectFiles);
        this.setProjectFolderPath();
      });
  }

  setProjectFolderPath() {
    if (this.project.projectFiles && this.project.projectFiles.length > 0) {
      let filePath = this.project.projectFiles[0].filePath;
      if (filePath && filePath != '') {
        let filePathList = filePath.split('\\');
        if (filePathList.length <= 0) {
          filePathList = filePath.split('/');
        }
        if (filePathList.length >= 1) {
          filePathList.pop();
          this.projectFolderPath = filePathList.join('\\');
        }
      }
    }
  }

  ngOnDestroy() {
    this.projectGetSub?.unsubscribe();
  }

  onCancel() {
    this.location.back();
  }
}
