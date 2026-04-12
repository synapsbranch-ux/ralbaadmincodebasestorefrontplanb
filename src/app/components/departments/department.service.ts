import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class DepartmentService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }


  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  allDepartmentAdmin() {
    const url = environment.baseUrl + 'admin/department/list';
    return this.securityService.signedRequest('GET', url);   
  }


  singleDepartmentDeleteAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/department/delete';
    return this.securityService.signedRequest('POST', url, data);
  }



  singleDepartmentStatuschange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/department/statuschange';
    return this.securityService.signedRequest('POST', url, data);
  }


  singleDepartmentDetailsAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/department/details';
    return this.securityService.signedRequest('POST', url, data);
  }


  allStorelistAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  allelementlistAdmin() {
    const url = environment.baseUrl + 'admin/roomelement/list';
    return this.securityService.signedRequest('GET', url);
  }


  singleDepartmentUpdateAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/department/update';
    return this.securityService.signedRequest('POST', url, data);
  }


  /////////////////////////////////////////////////  API For VENDOR    //////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'vender/department/imageUpload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  allDepartment() {
    const url = environment.baseUrl + 'vender/department/list';
    return this.securityService.signedRequest('GET', url);
  }

  allStorelist(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  allelementlist() {
    const url = environment.baseUrl + 'vender/roomelement/list';
    return this.securityService.signedRequest('GET', url);
  }


  addDepartment(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/department/create';
    return this.securityService.signedRequest('POST', url, data);
  }


  singleDepartmentUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/department/update';
    return this.securityService.signedRequest('POST', url, data);
  }


  singleDepartmentDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/department/delete';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleDepartmentDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/department/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  departmentImageDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/department/imagedelete';
    return this.securityService.signedRequest('POST', url, data);
  }



}
