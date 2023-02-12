import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/shared/models/project';
import { ProjectService } from '../project.service';
import { GridOptions } from 'ag-grid-community';
import { ProjectFileView } from 'src/app/shared/models/project_file';
import { FileExtension } from 'src/app/shared/models/content_type';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';
import { ProjectFileGridActionComponent } from 'src/app/project_files/project-file-grid-action/project.file.grid.action.component';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-edit',
  moduleId: module.id,
  templateUrl: 'project.edit.component.html',
  styleUrls: ['project.edit.component.css'],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  projectId!: string;
  @ViewChild('form') form!: NgForm;

  project: Project = {
    projectId: '',
    projectName: '',
    projectLocation: '',
    projectFiles: [],
  };

  references: {
    fileExtensions: FileExtension[];
    categories: CustomSelectListItem[];
  } = {
    categories: [],
    fileExtensions: [],
  };

  projectGetSub: Subscription | undefined;
  projectEditSub: Subscription | undefined;
  getPathFilesSub: Subscription | undefined;

  projectFolderPath: string | undefined;

  projectFileGridOptions: Partial<GridOptions<ProjectFileView>> = {
    columnDefs: [
      {
        field: 'fileName',
        headerName: 'إسم الملف',
      },
      {
        field: 'contentTypeName',
        headerName: 'نوع المحتوى',
      }, {
        field: 'formattedFileSize',
        headerName: 'حجم الملف',
        valueGetter: (param) => param.node?.data?.formattedFileSize?.toString(),
      },
      {
        field: 'formattedDuration',
        headerName: 'مدة الملف',
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
        // headerValueGetter: this.bindGridService.localizeHeader.bind(this),
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
      editBtn: true,
      filePathBtn: true
    },
    rowSelection: 'multiple',
    rowData: [],
  };

  constructor(
    private storageService: StorageService,
    private bindGridService: BindGridService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // this.fileUploader.
    this.projectId = this.activatedRoute.snapshot.params['id'];
    this.projectFileGridOptions = this.bindGridService.modelIndex_bindGrid(
      this.projectFileGridOptions,
      false
    );
    this.onEditProjectGET();
  }

  onDeleteProjectFileRows(selectedRows: any[]) {
    this.projectFileGridOptions.api?.applyTransaction({
      remove: selectedRows,
    });
  }

  onAddProjectFile() {
    let folderPathControl = this.form.control.controls['projectFolderPath'];
    if (folderPathControl.valid) {
      this.getPathFilesSub = this.projectService
        .getPathFiles(folderPathControl.value)
        .subscribe({
          next: (data: any) => {
            let projectFiles: ProjectFileView[] = [];
            projectFiles.push(...data.result);
            console.log(projectFiles);
            this.projectFileGridOptions.api?.setRowData(projectFiles);
          },
        });
    } else {
      this.toastr.error('الرجاء إدخال مسار مجلد صحيح.');
    }
  }

  onEditProjectGET(): void {
    this.projectGetSub = this.projectService
      .onEditProjectGET(this.projectId)
      .subscribe((data: any) => {
        this.project = data.result.item;
        this.references = data.result.references;
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

  onEditProjectPOST() {
    this.projectEditSub = this.storageService
      .onEditModelPOST('project', this.projectId, {
        ...this.project,
      })
      .subscribe({
        next: () => {
          this.location.back();
        },
      });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.getAllGridRows();
      // this.project.projectFiles.forEach((element) => {
      //   element.filePath = this.projectFolderPath + '\\' + element.fileName;
      // });
      this.onEditProjectPOST();
    }
  }

  getAllGridRows() {
    let rowData: ProjectFileView[] = [];
    this.projectFileGridOptions.api?.forEachNode((node) => {
      if (node.data) {
        rowData.push(node.data);
      }
    });
    this.project.projectFiles = rowData;
    return rowData;
  }

  onCancel() {
    this.location.back();
  }

  ngOnDestroy() {
    this.projectGetSub?.unsubscribe();
    this.projectEditSub?.unsubscribe();
    this.getPathFilesSub?.unsubscribe();
  }
}
