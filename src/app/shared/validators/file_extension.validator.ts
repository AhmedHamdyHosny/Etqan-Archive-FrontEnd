import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[fileExtension]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FileExtensionDirective,
      multi: true,
    },
  ],
})
export class FileExtensionDirective implements Validator {
  @Input('fileExtension') fileExtension: boolean = true;
  
  validate(control: AbstractControl): ValidationErrors | null {
    return this.fileExtension ? fileExtensionValidator()(control) : null;
  }
}

export function fileExtensionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      let filePathArr = control.value.split('\\');
      if (filePathArr.length == 1) {
        filePathArr = control.value.split('/');
      }
      if (filePathArr.length > 1) {
        let fileName = filePathArr[filePathArr.length - 1];
        let fileNameArr = fileName.split('.');
        if (fileNameArr.length <= 1) {
          return { 'invalidFileExtension': true };
        }
      } else {
        return { 'invalidFileExtension': true };
      }
    }
    return null;
  };
}
