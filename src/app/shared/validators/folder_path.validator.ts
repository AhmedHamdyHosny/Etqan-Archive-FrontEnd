import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[folderPath]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FolderPathDirective,
      multi: true,
    },
  ],
})
export class FolderPathDirective implements Validator {
  @Input('folderPath') folderPath: boolean = true;
  
  validate(control: AbstractControl): ValidationErrors | null {
    return this.folderPath ? folderPathValidator()(control) : null;
  }
}

export function folderPathValidator(): ValidatorFn {
  return (control: AbstractControl<string|undefined|null>): ValidationErrors | null => {
    if (control.value) {
      let lastChar = control.value.slice(-1);
      if (lastChar == '/' || lastChar == '\\') {
        return { 'invalidFolderPath': true };
      } 
    }
    return null;
  };
}
