import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-category-grid-action',
  moduleId: module.id,
  templateUrl: 'category.grid.action.component.html',
  styleUrls: ['category.grid.action.component.css']
})
export class CategoryGridActionComponent implements ICellRendererAngularComp {
  params: any;

  constructor(private router: Router) {}

  agInit(params: any): void {
    this.params = params;
  }

  onDetail() {
    this.router.navigate([
      'category',
      this.params.node.data.categoryId,
      'detail',
    ]);
  }

  onEdit() {
    this.router.navigate([
      'category',
      this.params.node.data.categoryId,
      'edit',
    ]);
  }

  refresh(): boolean {
    return false;
  }
}

