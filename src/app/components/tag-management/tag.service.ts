import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class TagService {

  token: any;

  constructor(private http: HttpClient,  private securityService: SecurityService) {

  }

  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////


  alltaglist(page: number, pageSize: number): Observable<any> {
    const url = environment.baseUrl + `admin/tag/list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'admin/tag/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  singleTagDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/tag/details';
    return this.securityService.signedRequest('POST', url, data);
  }
  singleTagAdd(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/tag/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleTagUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/tag/update';
    return this.securityService.signedRequest('POST', url, data);
  }

}