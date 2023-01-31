import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomSelectListItem } from 'src/app/shared/models/generic_data_format';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( ()=> SelectComponent ),
      multi: true
    }
  ]
})
export class SelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

  
  @Input()  disabled: boolean = false;
  @Input()  label: string = '';
  @Input()  required: boolean| string = false;
  @Input()  loginControl: boolean = false;
  @Input()  value: string | null = null; 
  @Input()  form!: NgForm;
  // @Input()  items: any[];
  @Input()  menuItems: CustomSelectListItem[] = [];
  @Input()  bindLabel: any;
  @Input()  clearable: any = true;;

  @Input()  requiredErrorMsg: string = 'This field is required';
  errorMsg = 'This field is required';

  @ViewChild('select') control!: UntypedFormControl
  
  @Output() change = new EventEmitter<any>()
  
  constructor() {

   }

   
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
  }


onChangeEvent() {
  this.change.emit(this.control.value);
  this.validation()
}
  


  validation() {
    const Error = this.control.errors;
    if(Error && Error['required']) {
      this.errorMsg = this.requiredErrorMsg;
    }
  }

// infrastructure
 registerOnChange(fn: any) { this.onChange = fn; }
 registerOnTouched(fn: any) { this.onTouch = fn; }

 onChange = (text: any) => { };
 onTouch = () => { };

/**
 * inner value
 */

/**
 * on changes hook
 */
 ngOnChanges(): void {
    if ( this.disabled ) {
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
 get SelectValue(): any {
    return this.value;
};

 set SelectValue(value: any) {
    if ( value !== 'undefined' ) {
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
