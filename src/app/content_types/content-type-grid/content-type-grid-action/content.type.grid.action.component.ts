import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-content-type-grid-action',
  moduleId: module.id,
  templateUrl: 'content.type.grid.action.component.html',
  styleUrls: ['content.type.grid.action.component.css']
})
export class ContentTypeGridActionComponent implements ICellRendererAngularComp {
  params: any;

  constructor(private router: Router) {}

  agInit(params: any): void {
    this.params = params;
  }

  onEdit() {
    this.router.navigate([
      'content-type',
      this.params.node.data.contentTypeId,
      'edit',
    ]);
  }

  onDetail() {
    this.router.navigate([
      'content-type',
      this.params.node.data.contentTypeId,
      'detail',
    ]);
  }

  refresh(): boolean {
    return false;
  }
}


