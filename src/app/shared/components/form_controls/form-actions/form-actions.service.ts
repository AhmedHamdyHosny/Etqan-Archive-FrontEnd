// import { Injectable } from "@angular/core";
// import { Observable, Subject } from "rxjs";

// @Injectable({providedIn: 'root'})
// export class FormActionService {
  
//   formSubmitted = new Subject<any>();
//   dialogFormSubmitted = new Subject<any>();

//     constructor() {}

//   emitFormSubmitted() {
//     this.formSubmitted.next(null);
//   }

//   formSubmittedEvent(): Observable<any> {
//     return this.formSubmitted.asObservable();
//   }
//   emitDialogFormSubmitted(any: any) {
//     this.dialogFormSubmitted.next(any);
//   }

//   dialogFormSubmittedEvent(): Observable<any> {
//     return this.dialogFormSubmitted.asObservable();
//   }


// }