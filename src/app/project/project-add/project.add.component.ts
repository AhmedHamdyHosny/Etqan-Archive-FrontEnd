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
import {
  ProjectFile,
  ProjectFileView,
} from 'src/app/shared/models/project_file';
import { GridOptions } from 'ag-grid-community';
import { BindGridService } from 'src/app/shared/components/grid/custom-grid-options';
import { ProjectFileGridActionComponent } from 'src/app/project_files/project-file-grid-action/project.file.grid.action.component';
import { FileExtension } from 'src/app/shared/models/content_type';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';
import { ProjectService } from '../project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-add',
  moduleId: module.id,
  templateUrl: 'project.add.component.html',
  styleUrls: ['project.add.component.css'],
})
export class ProjectAddComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: NgForm;
  project: Project = {
    projectId: '',
    projectName: '',
    projectLocation: '',
    projectFiles: [],
  };

  projectFolderPath: string | undefined;

  references: {
    fileExtensions: FileExtension[];
    categories: CustomSelectListItem[];
  } = {
    categories: [],
    fileExtensions: [],
  };

  projectGetSub: Subscription | undefined;
  projectCreateSub: Subscription | undefined;
  getPathFilesSub: Subscription | undefined;

  projectFileGridOptions: Partial<GridOptions<ProjectFileView>> = {
    columnDefs: [
      {
        field: 'fileName',
        headerName: 'إسم الملف',
      },
      {
        field: 'contentTypeName',
        headerName: 'نوع المحتوى',
        valueGetter: (param) => param.node?.data?.contentTypeName,
        cellStyle: (params) => {
          if (!params.value || params.value == '') {
            //mark cell as red
            return { backgroundColor: '#D10000' };
          }
          return { backgroundColor: 'transparent' };
        },
      },
      {
        field: 'formattedFileSize',
        headerName: 'حجم الملف',
      },
      {
        field: 'formattedDuration',
        headerName: 'مدة الملف',
      },
      {
        field: 'categoryName',
        headerName: 'فئه المحتوى',
        valueGetter: (param) => param.node?.data?.category?.categoryName,
        cellStyle: (params) => {
          if (!params.value || params.value == '') {
            //mark cells as red
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
    private toastr: ToastrService,
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

  onAddProjectFile() {
    let folderPathControl = this.form.control.controls['projectFolderPath'];
    if (folderPathControl.valid) {
      this.getPathFilesSub = this.projectService
        .getPathFiles(folderPathControl.value)
        .subscribe({
          next: (data: any) => {
            let projectFiles: ProjectFileView[] = [];
            projectFiles.push(...data.result);
            this.projectFileGridOptions.api?.setRowData(projectFiles);
          },
        });
    } else {
      this.toastr.error('الرجاء إدخال مسار مجلد صحيح.');
    }
  }

  onDeleteProjectFileRows(selectedRows: any[]) {
    this.projectFileGridOptions.api?.applyTransaction({
      remove: selectedRows,
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
      // this.project.projectFiles.forEach((element) => {
      //   element.filePath = this.projectFolderPath + '\\' + element.fileName;
      // });
      this.onCreateProjectPOST();
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

  ngOnDestroy() {
    this.projectGetSub?.unsubscribe();
    this.projectCreateSub?.unsubscribe();
    this.getPathFilesSub?.unsubscribe();
  }
}
