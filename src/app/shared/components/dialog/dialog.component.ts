import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  Header: string;
  Text: string;
  yesBtn?: boolean;
  yesBtnValue?: string;
}

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  get yesBtnValue() {
    return this.data.yesBtnValue || 'نعم';
  }

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translate: TranslateService
  ) {}

  isLargeScreen() {
    const windowWidth = window.innerWidth;
    if (windowWidth > 600) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {}

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {}
}
