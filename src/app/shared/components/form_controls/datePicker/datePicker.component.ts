import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  ControlValueAccessor,
  UntypedFormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime-ex';

export const MY_NATIVE_FORMATS = {
  fullPickerInput: 'dd/MM/yyyy LT',
  parseInput: 'dd/MM/yyyy LT',
  datePickerInput: 'dd/MM/yyyy',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
  // fullPickerInput: {
  //   year: 'numeric',
  //   month: 'numeric',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  // },
  // datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
  // timePickerInput: { hour: 'numeric', minute: 'numeric' },
  // monthYearLabel: { year: 'numeric', month: 'short' },
  // dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  // monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

@Component({
  selector: 'app-datePicker',
  templateUrl: './datePicker.component.html',
  styleUrls: ['./datePicker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS },
  ],
})
export class DatePickerComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() disabled: boolean = false;

  @Input() form!: NgForm;

  @Input() label: string = '';
  @Input() min: Date | undefined;
  @Input() max: Date | undefined;
  @Input() required: boolean = false;
  @Input() value: Date | undefined; //date model

  @ViewChild('fieldInput') control!: UntypedFormControl;

  errorMsg: string = 'This field is required';

  @Input() requiredErrorMsg: string = 'This field is required';

  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>
  ) {}

  ngOnDestroy(): void {}

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit(): void {}

  validation() {
    const Error = this.control.errors;
    if (Error && Error['required']) {
      this.errorMsg = this.requiredErrorMsg;
    }
    if (Error && Error['owlDateTimeParse']) {
      this.errorMsg = 'Invalid Date format';
    }

    // picker with min and max
    // <input [min]="min" [max]="max" [owlDateTimeTrigger]="dt" [owlDateTime]="dt" #dateTime="ngModel">
    // <owl-date-time #dt></owl-date-time>
    // <div *ngIf="dateTime.invalid && dateTime.errors.owlDateTimeMin">
    //     Date Time value must after {{min | date: 'medium'}}
    // </div>
    // <div *ngIf="dateTime.invalid && dateTime.errors.owlDateTimeMax">
    //     Date Time value must before {{max | date: 'medium'}}
    // </div>
  }

  // infrastructure
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  onChange = (value: any) => {};
  onTouch = () => {};

  /**
   * inner value
   */

  /**
   * on changes hook
   */
  ngOnChanges(): void {
    if (this.disabled) {
      this.onChange(this.value);
    }
  }

  /**
   * input events
   */
  public onBlur(): void {
    this.onChange(this.value);
    this.onTouch();
  }

  /**
   * value accessor setter and getter
   */
  get InputValue(): any {
    return this.value;
  }

  set InputValue(value: any) {
    if (value !== 'undefined') {
      this.value = value;
      this.onChange(value);
      this.onTouch();
    }
  }

  writeValue(value: any): void {
    if (value !== this.value) {
      this.value = value;
    }
  }
}
