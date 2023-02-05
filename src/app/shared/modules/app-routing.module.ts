import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { CategoryAddComponent } from 'src/app/categories/category-add/category.add.component';
import { CategoryDetailComponent } from 'src/app/categories/category-detail/category.detail.component';
import { CategoryEditComponent } from 'src/app/categories/category-edit/category.edit.component';
import { CategoryGridComponent } from 'src/app/categories/category-grid/category.grid.component';
import { ProjectAddComponent } from 'src/app/project/project-add/project.add.component';
import { ProjectEditComponent } from 'src/app/project/project-edit/project.edit.component';
import { ProjectGridComponent } from 'src/app/project/project-grid/project.grid.component';
import { SearchComponent } from 'src/app/project_files/search/search.component';
import { ProjectFileAddComponent } from 'src/app/project_files/project-file-add/project.file.add.component';
import { ProjectFileDetailComponent } from 'src/app/project_files/project-file-detail/project.file.detail.component';
import { ProjectFileEditComponent } from 'src/app/project_files/project-file-edit/project.file.edit.component';
import { ProjectFileGridComponent } from 'src/app/project_files/project-file-grid/project.file.grid.component';
import { PageNotFoundComponent } from '../components/page-not-found/page.not.found.component';
import { AuthGuard } from '../guard/auth.guard';
import { ContentTypeGridComponent } from 'src/app/content_types/content-type-grid/content.type.grid.component';
import { ContentTypeAddComponent } from 'src/app/content_types/content-type-add/content.type.add.component';
import { ContentTypeDetailComponent } from 'src/app/content_types/content-type-detail/content.type.detail.component';
import { ContentTypeEditComponent } from 'src/app/content_types/content-type-edit/content.type.edit.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent},
  
  { path: 'category/index', component: CategoryGridComponent, canActivate: [AuthGuard]},
  { path: 'category/add', component: CategoryAddComponent, canActivate: [AuthGuard]},
  { path: 'category/:id/edit', component: CategoryEditComponent, canActivate: [AuthGuard]},
  { path: 'category/:id/detail', component: CategoryDetailComponent, canActivate: [AuthGuard]},

  { path: 'project/index', component: ProjectGridComponent, canActivate: [AuthGuard]},
  { path: 'project/add', component: ProjectAddComponent, canActivate: [AuthGuard]},
  { path: 'project/:id/edit', component: ProjectEditComponent, canActivate: [AuthGuard]},
  
  { path: 'project-file/index', component: ProjectFileGridComponent, canActivate: [AuthGuard]},
  { path: 'project-file/add', component: ProjectFileAddComponent, canActivate: [AuthGuard]},
  { path: 'project-file/:id/edit', component: ProjectFileEditComponent, canActivate: [AuthGuard]},
  { path: 'project-file/:id/detail', component: ProjectFileDetailComponent, canActivate: [AuthGuard]},
  
  { path: 'content-type/index', component: ContentTypeGridComponent, canActivate: [AuthGuard]},
  { path: 'content-type/add', component: ContentTypeAddComponent, canActivate: [AuthGuard]},
  { path: 'content-type/:id/edit', component: ContentTypeEditComponent, canActivate: [AuthGuard]},
  { path: 'content-type/:id/detail', component: ContentTypeDetailComponent, canActivate: [AuthGuard]},

  { path: 'not-found', component: PageNotFoundComponent },

  { path: '', redirectTo: '/search', pathMatch: 'full' }, // redirect to `home-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
