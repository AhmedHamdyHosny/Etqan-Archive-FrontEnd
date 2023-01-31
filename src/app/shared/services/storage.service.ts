import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StorageService {

  baseUrl :string = environment.ApiUrl;
  gridLoader = false;

  LoadingEvent: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  setPageLoader(loading:boolean){
    this.LoadingEvent.next(loading);
  }

  getGridView(model: string, body: any) {
    this.gridLoader = true;
    return this.http.post(this.baseUrl + model + '/getgridview', body);
  }

  onCreateModelGET(model: string) {
    return this.http.get(this.baseUrl + model + '/create');
  }

  onCreateModelPOST(model: string, body: any) {
    return this.http.post(this.baseUrl + model + '/create', body);
  }

  onGetModelDetails(model: string, Id: string) {
    return this.http.get(this.baseUrl + model + '/details/' + Id);
  }

  onEditModelGET(model: string, Id: string) {
    return this.http.get(this.baseUrl + model + '/edit/' + Id);
  }

  onEditModelPOST(model: string, Id: string, body: any) {
    return this.http.post(this.baseUrl + model + '/edit/' + Id, body);
  }

  onDeleteModel(model: string, IdList: string[]) {
    this.gridLoader = true;
    return this.http.post(this.baseUrl + model + '/DeleteGroup', IdList);
  }

  onModelIndex(model: string) {
    return this.http.get(this.baseUrl + model + '/index');
  }

}
