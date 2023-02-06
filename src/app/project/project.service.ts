import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileExtension } from '../shared/models/content_type';
import { CustomSelectListItem } from '../shared/models/generic_data_format';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  referencesSub = new BehaviorSubject<{
    fileExtensions: FileExtension[];
    categories: CustomSelectListItem[];
  }>({
    categories: [],
    fileExtensions: [],
  });

  constructor(private http: HttpClient, private router: Router) {}

  onCreateProjectGET() {
    return this.http.get(environment.ApiUrl + 'project/create').pipe(
      tap((data: any) => {
        this.referencesSub.next(data.result.references);
      })
    );
  }

  onEditProjectGET(id: string) {
    return this.http.get(environment.ApiUrl + 'project/edit/' + id).pipe(
      tap((data: any) => {
        this.referencesSub.next(data.result.references);
      })
    );
  }


}
