import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class SubAdminService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }


  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  allSubAdmin(page: number, pageSize: number) {
    const url = environment.baseUrl + `admin/subadmin-list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchSubAdmin(search: any) {
    const url = environment.baseUrl + `admin/subadmin-search?search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  addSubadmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleSubadminDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/subadmin-details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleSubadminUpdateAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/subadmin-update';
    return this.securityService.signedRequest('POST', url, data);
  }

}