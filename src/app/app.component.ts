import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './shared/models/user';
import { StorageService } from './shared/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Archive';
  currentLang: string | null = 'en';
  userSub: Subscription | null = null;
  user: User | null = null;
  isLoading: boolean = false;
  loaderSub:Subscription|undefined;

  constructor(private authService: AuthService, 
    public storageService: StorageService,){
    this.userSub = this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.loaderSub = this.storageService.LoadingEvent.pipe(delay(0)).subscribe({
      next: (loading) => {
        this.isLoading = loading;
      }
    });
  }

  dismissSidebar() {
    document
      .getElementsByClassName('sidebar-overlay')[0]
      .classList.remove('active');
    document.getElementsByClassName('sidebar')[0].classList.remove('active');
  }

  openSidebar() {
    document
      .getElementsByClassName('sidebar-overlay')[0]
      .classList.add('active');
    document.getElementsByClassName('sidebar')[0].classList.add('active');
  }



  signOut(){
    this.authService.logout();
  }


  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.loaderSub?.unsubscribe();
  }

}
