import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrls: ['./form-actions.component.css'],
})
export class FormActionsComponent implements OnInit, OnDestroy {
  @Input() submitValue: string = 'حفظ';
  @Input() cancelValue: string = 'إلغاء';
  @Input() form: NgForm | undefined;
  @Input() alerts: boolean = true;
  @Input() actionType: string | undefined;
  @Input() cancelCallback: boolean = false;
  @Output() cancel = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  rtl = true;
  editSub: Subscription | undefined;
  dialogRef!: MatDialogRef<DialogComponent>;
  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {}

  isLargeScreen() {
    const windowWidth = window.innerWidth;
    if (windowWidth > 600) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    if (this.editSub) {
      this.editSub.unsubscribe();
    }
  }

  ngOnInit(): void {}

  oncancel() {
    if (this.form) {
      if (this.form.dirty && this.alerts) {
        this.dialogRef = this.dialog.open(DialogComponent, {
          data: {
            Header: 'تأكيد',
            Text: 'هل أنت متأكد أنك تريد تجاهل هذه البيانات؟',
            yesBtnValue: 'أوافق',
          },
          autoFocus: false,
        });
        this.dialogRef.afterClosed().subscribe((result) => {
          if (result != undefined) {
            if (!this.cancelCallback) {
              this.router.navigate(['../', 'index'], {
                relativeTo: this.activatedRoute,
              });
            }
            this.cancel.emit();
          }
        });
      } else {
        if (!this.cancelCallback) {
          this.router.navigate(['../', 'index'], {
            relativeTo: this.activatedRoute,
          });
        }
        this.cancel.emit();
      }
    } else {
      if (!this.cancelCallback) {
        this.router.navigate(['../', 'index'], {
          relativeTo: this.activatedRoute,
        });
      }
      this.cancel.emit();
    }
  }

  onsubmit() {
    this.save.emit();
    if (this.form) {
      if (!this.form.valid && this.alerts) {
        this.dialogRef = this.dialog.open(DialogComponent, {
          data: {
            Header: 'خطأ',
            Text: 'يرجى إدخال البيانات المطلوبة',
            yesBtn: true,
            yesBtnValue: 'حسنا',
          },
          autoFocus: false,
        });
      }
    }
  }
}
