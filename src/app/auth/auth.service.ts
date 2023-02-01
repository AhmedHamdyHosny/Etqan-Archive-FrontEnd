import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  tokenExpireationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post(environment.ApiUrl + 'account/login', {
        Username: email,
        Password: password,
        RememberMe: true,
      })
      .pipe(
        tap((data: any) => {
          const tokenInfo = {
            accessToken: data.result.accessToken,
            refreshToken: data.result.refreshToken,
            expireDate: data.result.expireDate,
          };
          const user = new User(
            tokenInfo.accessToken,
            tokenInfo.refreshToken,
            tokenInfo.expireDate
          );
          this.user.next(user);
          localStorage.removeItem('etqanArchiveToken');
          localStorage.setItem('etqanArchiveToken', JSON.stringify(tokenInfo));
          this.autoLogout(new Date(tokenInfo.expireDate));
          this.router.navigate(['/search']);
         
        })
      );
  }

  autoLogin() {
    let tokenJson: string | null = localStorage.getItem('etqanArchiveToken');
    if (tokenJson) {
      let tokenInfo: {
        accessToken: string;
        refreshToken: string;
        expireDate: string;
      } = JSON.parse(tokenJson);
      const loadedUser = new User(
        tokenInfo.accessToken,
        tokenInfo.refreshToken,
        new Date(tokenInfo.expireDate)
      );
      if (loadedUser.AccessToken) {
        this.user.next(loadedUser);
        this.autoLogout(new Date(tokenInfo.expireDate));
      } else {
        localStorage.removeItem('etqanArchiveToken');
      }
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('etqanArchiveToken');
    this.router.navigate(['/search']);
    if (this.tokenExpireationTimer) {
      clearTimeout(this.tokenExpireationTimer);
      this.tokenExpireationTimer = null;
    }
  }

  autoLogout(expireDate: Date) {
    const duration = expireDate.getTime() - new Date().getTime();
    this.tokenExpireationTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }
}
