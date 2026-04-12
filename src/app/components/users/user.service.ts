import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class UsersService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }
  /////////// Admin API LIst
  allUserListAdmin(page: number, pageSize: number) {
    const url = environment.baseUrl + `admin/user/list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchUserListAdmin(search: any) {
    const url = environment.baseUrl + `admin/user/search?search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  userStatuschange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/user/statusChange';
    return this.securityService.signedRequest('POST', url, data);
  }


  singleUserDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/user/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  addUser(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/user/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  EditUser(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/user/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  allOrderList(data: any) {
    const url = environment.baseUrl + 'admin/user/orderList';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleOrderDetails(data: any) {
    const url = environment.baseUrl + 'admin/user/orderDetails';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleOrderUpdate(data: any) {
    const url = environment.baseUrl + 'admin/user/orderUpdate';
    return this.securityService.signedRequest('POST', url, data);
  }


  ///////////////////// Vendor API List



  singleVendorUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/update';
    return this.securityService.signedRequest('POST', url, data);
  }


  singleStoreDetailsvAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/store/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  allStorelistvAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/store/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleStoreUpdateAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/update';
    return this.securityService.signedRequest('POST', url, data);
  }

}