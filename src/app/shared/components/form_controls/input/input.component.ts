import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormControl,
  NgForm,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  @Input() pattern:string | RegExp = '';
  @Input() disabled: boolean = false;
  @Input() fileExtension: boolean = false;
  @Input() minlength: number = 0;
  @Input() inputType = 'text';
  @Input() step: number | undefined;
  @Input() min: number | undefined;
  @Input() max: number | undefined;
  @Input() maxlength:string| number | null = null;
  @Input() error: any;

  @Input() label: string | undefined;
  @Input() phone: boolean = false;
  @Input() required: boolean = false;
  @Input() email: boolean = false;
  // @Input()  password: boolean = false;
  @Input() value: string | null = null;
  // @Input()  invalid: string |null = null;

  @Input() form!: NgForm;
  @ViewChild('fieldInput') control!: UntypedFormControl;
  textErrorMsg: string = 'مطلوب الادخال';
  @Input() requiredErrorMsg: string = 'مطلوب الادخال';
  @Input() foriddenNameErrorMsg: string = 'This name is forbidden';
  @Input() patternErrorMsg: string = 'Invalid pattern';
  rtl = 'ltr';
  // @Input()  confirmPassword:string | undefined;

  @Output() change = new EventEmitter<string>();

  constructor(
  ) {

  }

  ngOnDestroy(): void {}

  direction() {
  }

  ngOnInit(): void {}

  onChangeEvent() {
    this.change.emit(this.control.value);
    this.validation();
  }

  validation() {
    let Error = this.control.errors;
    // if(this.invalid) {
    //   this.textErrorMsg = this.invalid;
    // }

    if (Error && Error['pattern'] && Error['pattern']['requiredPattern']) {
      this.textErrorMsg = this.patternErrorMsg;
    }
    if (Error && Error['nameIsForbidden']) {
      this.textErrorMsg = this.foriddenNameErrorMsg;
    }
    if (Error && Error['email']) {
      this.textErrorMsg = 'Email is not valid';
    }
    if (this.inputType == 'password') {
      if (Error && Error['invalidPassword']) {
        this.textErrorMsg = 'invalid password format';
      }

      if (Error && Error['passwordNotMatch']) {
        this.textErrorMsg = 'Password Not Match';
      }
    }
    if (Error && Error['required']) {
      this.textErrorMsg = this.requiredErrorMsg;
    }
    if(Error && Error['invalidFileExtension']){
      this.textErrorMsg = 'مسار الملف المدخل خطأ';
    }
  }

  // infrastructure
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  onChange = (text: string | null) => {};
  onTouch = () => {};

  ngOnChanges(): void {
    if (this.disabled) {
      this.onChange(this.value);
    }
  }

  public onBlur(): void {
    this.onChange(this.value);
    this.onTouch();
  }

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
