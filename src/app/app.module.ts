import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './shared/modules/app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from './shared/modules/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProjectGridComponent } from './project/project-grid/project.grid.component';
import { ProjectAddComponent } from './project/project-add/project.add.component';
import { ProjectGridActionComponent } from './project/project-grid/project-grid-action/project.grid.action.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './project_files/search/search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProjectEditComponent } from './project/project-edit/project.edit.component';
import { ProjectFileGridActionComponent } from './project_files/project-file-grid/project-file-grid-action/project.file.grid.action.component';
import { ProjectFileGridComponent } from './project_files/project-file-grid/project.file.grid.component';
import { ProjectFileAddComponent } from './project_files/project-file-add/project.file.add.component';
import { ProjectFileEditComponent } from './project_files/project-file-edit/project.file.edit.component';
import { ProjectFileDetailComponent } from './project_files/project-file-detail/project.file.detail.component';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptorService } from './shared/interceptors/auth.interceptor.service';
import { ErrorInterceptorService } from './shared/interceptors/error.interceptor.service';
import { CategoryAddComponent } from './categories/category-add/category.add.component';
import { CategoryDetailComponent } from './categories/category-detail/category.detail.component';
import { CategoryEditComponent } from './categories/category-edit/category.edit.component';
import { CategoryGridActionComponent } from './categories/category-grid/category-grid-action/category.grid.action.component';
import { CategoryGridComponent } from './categories/category-grid/category.grid.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CategoryGridComponent,
    CategoryGridActionComponent,
    CategoryAddComponent,
    CategoryEditComponent,
    CategoryDetailComponent,
    ProjectGridComponent,
    ProjectGridActionComponent,
    ProjectAddComponent,
    ProjectEditComponent,
    SearchComponent,
    ProjectFileGridComponent,
    ProjectFileGridActionComponent,
    ProjectFileAddComponent,
    ProjectFileEditComponent,
    ProjectFileDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ToastrModule.forRoot(),
    SharedModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}