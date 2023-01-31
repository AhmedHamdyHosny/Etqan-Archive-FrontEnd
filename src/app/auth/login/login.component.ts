import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnDestroy{
  userPassword: string | undefined;
  userEmail: string | undefined;
  
  submitted = false;
  loginSub: Subscription|null = null;


  constructor(private authService: AuthService) {
 
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.loginSub = this.authService.login(this.userEmail!, this.userPassword!).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}

