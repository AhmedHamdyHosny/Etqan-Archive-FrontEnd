import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectFileService {
  
  constructor(private http: HttpClient, private router: Router) {}

  getFilters() {
    return this.http
      .get(environment.ApiUrl + 'projectFile/search/filters');
  }

  getProjectFiles(filtetModel: any){
    return this.http
      .post(environment.ApiUrl + 'projectFile/search', filtetModel);
  }



}
