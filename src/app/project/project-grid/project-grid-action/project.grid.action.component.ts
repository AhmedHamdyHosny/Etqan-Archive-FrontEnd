import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-project-grid-action',
  moduleId: module.id,
  templateUrl: 'project.grid.action.component.html',
  styleUrls: ['project.grid.action.component.css']
})
export class ProjectGridActionComponent implements ICellRendererAngularComp {
  params: any;

  constructor(private router: Router) {}

  agInit(params: any): void {
    this.params = params;
  }

  onDetail() {
    this.router.navigate([
      'project',
      this.params.node.data.projectId,
      'detail',
    ]);
  }

  onEdit() {
    this.router.navigate([
      'project',
      this.params.node.data.projectId,
      'edit',
    ]);
  }

  refresh(): boolean {
    return false;
  }
}

