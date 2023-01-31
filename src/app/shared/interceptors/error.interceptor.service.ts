import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
    private toastService: ToastrService,
    private storageService: StorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.storageService.setPageLoader(true);
    // this.storageService.LoadingEvent.next(true);
    return next.handle(request).pipe(
      map((response: HttpEvent<any>) => {
        if (response instanceof HttpResponse) {
          // this.storageService.LoaderEvent.next(false);
          if (response.status == 200) {
            if (response.body?.isSuccess == false) {
              if (response.body?.message && response.body?.message != '') {
                this.toastService.error(response.body.message, 'Error');
              }
              throw throwError(() => response);
            }
          }
        }
        return response;
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.error) {
            if (err.error.isSuccess == false) {
              if (err.error.message && err.error.message != '') {
                this.toastService.error(err.error.message, 'Error');
              }
            } else if (err.error.errors) {
              if (
                Array.isArray(err.error.errors) &&
                err.error.errors.length > 0
              ) {
                this.toastService.error(err.error.errors[0], 'Error');
              } else if (typeof err.error.errors == 'object') {
                const msg: string = Object.values(
                  err.error.errors
                )[0] as string;
                this.toastService.error(msg, 'Error');
              }
            }
          }
        }
        return throwError(() => err);
      }),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests == 0) {
          this.storageService.setPageLoader(false);
        }
        // this.storageService.LoadingEvent.next(false);
      }),
    );
  }
}
