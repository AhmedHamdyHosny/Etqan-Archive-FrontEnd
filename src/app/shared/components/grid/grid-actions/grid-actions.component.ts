import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-grid-actions',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.css'],
})
export class GridActionsRenderer implements ICellRendererAngularComp {
  private params: any;
  // detailSub:Subscription;
  editOnly: boolean = false;
  detailOnly: boolean = false;
  // dialogDetailRef: MatDialogRef<CustomerContactDetailComponent>;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  agInit(params: any): void {
    this.params = params;
    if (this.params.context && this.params.context.editOnly) {
      this.editOnly = true;
    }
    if (this.params.context && this.params.context.detailOnly) {
      this.detailOnly = true;
    }
  }

  onDetail() {
    if (this.params.context && this.params.context.detailDialog) {
      // this.dialogDetailRef = this.dialog.open(CustomerContactDetailComponent, {
      //   data: {...this.params.node.data},
      //   panelClass: 'customer-contact-dialog',
      //   autoFocus: false
      // });
    } else {
      this.router.navigate(['../', 'detail'], { relativeTo: this.activeRoute });
      // this.GlobalService.emitGridDetail(this.params.node.data);
      
    }
  }

  onEdit() {
    // if(this.params.context && this.params.context.editDialog){
    //   this.GlobalService.emitGridEditViaDialog(this.params.node.data);
    // }else{
    //   this.GlobalService.emitGridEdit(this.params.node.data);
    //   this.router.navigate(['../', 'edit'], {relativeTo: this.activeRoute});
    // }
  }

  refresh(): boolean {
    return false;
  }
}
