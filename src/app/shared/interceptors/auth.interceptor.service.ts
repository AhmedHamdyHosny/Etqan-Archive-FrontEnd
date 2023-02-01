import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  exhaustMap,
  Observable,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  // private isRefreshing = false;
  // private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
  //   null
  // );
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          let updateHeaders = request.headers.append(
            'Content-Type',
            'application/json'
          );
          if (user?.AccessToken) {
            updateHeaders = updateHeaders.append(
              'Authorization',
              'Bearer ' + user.AccessToken
            );
          }
          const modifiedRequest = request.clone({
            headers: updateHeaders,
          });
          return next.handle(modifiedRequest);
        })
      )
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.authService.logout();
              // return this.handle401Error(request, next);
            }
          }
          return throwError(() => err);
        })
      );
  }

  // private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     this.refreshTokenSubject.next(null);
  //     const tokenJson: string | null = localStorage.getItem('etqanArchiveToken');
  //     if (tokenJson) {
  //       const tokendata = JSON.parse(tokenJson);
  //       return this.authService
  //         .refreshToken(tokendata.accessToken, tokendata.refreshToken)
  //         .pipe(
  //           switchMap(() => {
  //             this.isRefreshing = false;
  //             alert('token refreshed');
  //             window.location.reload();
  //             // this.tokenService.saveToken(token.accessToken);
  //             this.refreshTokenSubject.next(tokendata.accessToken);
  //             return next.handle(
  //               this.addTokenHeader(request, tokendata.accessToken)
  //             );
  //           }),
  //           catchError((err) => {
  //             window.location.reload();
  //             this.isRefreshing = false;

  //             // this.authService.logOut();
  //             return throwError(() => new Error(err));
  //           })
  //         );
  //     }
  //   }
  //   // return next.handle(request);
  //   return this.refreshTokenSubject.pipe(
  //     filter((token: any) => token !== null),
  //     take(1),
  //     switchMap((token) => next.handle(this.addTokenHeader(request, token)))
  //   );
  // }
  
  // private addTokenHeader(request: HttpRequest<any>, token: string) {
  //   return request.clone({
  //     headers: request.headers.set('Authorization', 'Bearer ' + token),
  //   });
  // }
}
