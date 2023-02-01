import { Component, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef( ()=> TextareaComponent ),
      multi: true
    }
  ]
})
export class TextareaComponent implements OnInit, ControlValueAccessor {
  @Input() pattern:RegExp = new RegExp('');
  @Input()  disabled: boolean = false;
  @Input()  label: string = '';
  @Input()  cols: number = 5;
  @Input()  rows: number = 3;
  @Input()  required: boolean = false;
  @Input()  value: string|null = null;
  @Input()  form: NgForm | undefined;
  
  // textAlignLeft;
  @ViewChild('textarea') control!: UntypedFormControl
  textErrorMsg:string = 'This field is required';

  @Input()  requiredErrorMsg: string = 'This field is required';
  @Input()  foriddenNameErrorMsg: string = 'This name is forbidden';
  @Input()  patternErrorMsg: string = 'No spaces allowed at the begining and the end of a text';

  constructor() {

   }
 
 
  
  ngOnInit(): void {
  }
  
  validation() {
    const Error = this.control.errors;
    if(!this.control.valid || !this.control.valid && this.form?.submitted) {

    if(Error && Error['pattern'] && Error['pattern']['requiredPattern']) {
      this.textErrorMsg = this.patternErrorMsg;
    }
    if(Error && Error['required']) {
      this.textErrorMsg = this.requiredErrorMsg;
    }
    if(Error && Error['nameIsForbidden']) {
      this.textErrorMsg = this.foriddenNameErrorMsg;
  }
  }
}

registerOnChange(fn: any) { this.onChange = fn; }
registerOnTouched(fn: any) { this.onTouch = fn; }

onChange = (text: string|null) => { };
onTouch = () => { };


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
get TextareaValue(): any {
   return this.value;
};

set TextareaValue(value: any) {
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
