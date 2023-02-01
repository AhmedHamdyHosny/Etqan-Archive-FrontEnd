import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-project-file-grid-action',
  moduleId: module.id,
  templateUrl: 'project.file.grid.action.component.html',
  styleUrls: ['project.file.grid.action.component.css'],
})
export class ProjectFileGridActionComponent
  implements ICellRendererAngularComp
{
  params: any;

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private toastr: ToastrService
  ) {}

  agInit(params: any): void {
    this.params = params;
  }

  onDetail() {
    this.router.navigate([
      'project-file',
      this.params.node.data.projectFileId,
      'detail',
    ]);
  }

  onEdit() {
    this.router.navigate([
      'project-file',
      this.params.node.data.projectFileId,
      'edit',
    ]);
  }

  onCopyLink() {
    if (this.params.node.data.filePath) {
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
}
