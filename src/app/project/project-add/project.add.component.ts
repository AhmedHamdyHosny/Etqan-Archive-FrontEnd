import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Project } from 'src/app/shared/models/project';
import { ProjectFile } from 'src/app/shared/models/project_file';
import { GridOptions } from 'ag-grid-community';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import { ProjectFileGridActionComponent } from 'src/app/project_files/project-file-grid-action/project.file.grid.action.component';
import { FileExtension } from 'src/app/shared/models/content_type';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-add',
  moduleId: module.id,
  templateUrl: 'project.add.component.html',
  styleUrls: ['project.add.component.css'],
})
export class ProjectAddComponent implements OnInit, OnDestroy {
  project: Project = {
    projectId: '',
    projectName: '',
    projectLocation: '',
    projectFiles: [],
  };

  projectFolderPath: string|undefined;

  references: {
    fileExtensions: FileExtension[];
    categories: CustomSelectListItem[];
  } = {
    categories: [],
    fileExtensions: [],
  };

  projectGetSub: Subscription | undefined;
  projectCreateSub: Subscription | undefined;

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
          return { backgroundColor: 'transparent'};
        },
      },
      {
        field: 'categoryName',
        headerName: 'فئه المحتوى',
        valueGetter: (param) =>
          param.node?.data?.category?.categoryName,
        cellStyle: (params) => {
          if (!params.value || params.value == '') {
            //mark cells as red
            return { backgroundColor: '#D10000' };
          }
          return { backgroundColor: 'transparent'};
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
    },
    rowSelection: 'multiple',
    rowData: [],
  };

  constructor(
    private storageService: StorageService,
    private bindGridService: BindGridService,
    private projectService: ProjectService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // this.fileUploader.
    this.projectFileGridOptions = this.bindGridService.modelIndex_bindGrid(
      this.projectFileGridOptions,
      false
    );
    this.onCreateProjectGET();
  }

  onDeleteProjectFileRows(selectedRows: any[]) {
    this.projectFileGridOptions.api?.applyTransaction({
      remove: selectedRows,
    });
  }

  onFilesSelected(event: any) {
    let projectFiles: ProjectFile[] = [];
    for (var i = 0; i < event.target.files.length; i++) {
      const file: File = event.target.files[i];
      console.log(file);
      let fileNameList = file.name.split('.');
      if (fileNameList.length > 1) {
        let extension = fileNameList[fileNameList.length - 1];
        let fileExtension = this.references.fileExtensions.find(
          (x) => x.fileExtensionName?.toLowerCase() == extension.toLowerCase()
        );
        if (fileExtension) {
          projectFiles.push(new ProjectFile(file.name, fileExtension));
        }
      }
    }
    this.projectFileGridOptions.api?.applyTransaction({
      add: projectFiles,
    });
  }

  onCreateProjectGET(): void {
    this.projectGetSub = this.projectService
      .onCreateProjectGET()
      .subscribe((data: any) => {
        this.project = data.result.item;
        this.references = data.result.references;
      });
  }

  onCreateProjectPOST() {
    this.projectCreateSub = this.storageService
      .onCreateModelPOST('project', {
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
      this.project.projectFiles.forEach(element => {
        element.filePath = this.projectFolderPath + '\\'+element.fileName;
      });
      console.log(this.project);
      this.onCreateProjectPOST();
    }
  }

  getAllGridRows() {
    let rowData: ProjectFile[] = [];
    this.projectFileGridOptions.api?.forEachNode((node) => {
      if (node.data) {
        rowData.push(node.data);
      }
    });
    this.project.projectFiles = rowData;
    return rowData;
  }

  ngOnDestroy() {
    this.projectGetSub?.unsubscribe();
    this.projectCreateSub?.unsubscribe();
  }
}
