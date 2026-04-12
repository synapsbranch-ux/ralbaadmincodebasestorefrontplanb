import { Injectable, Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SecurityService } from 'src/security.service';



@Injectable({
  providedIn: 'root'
})
export class AdminService {
  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) { }

  btoken = localStorage.getItem('_eComm_b_auth_token') ?? 'qwertyuiopasdfghjklzxcvbnm';
  isLoggedIn = (localStorage.getItem('_eComm_admin_access')) ? true : false;
  adminLoggedType = localStorage.getItem('_eComm_u_type') ?? '';

  login(email: string, password: string) {
    let bodyData = { email: email, password: password };

    const url = environment.baseUrl + 'admin/login';
    return this.securityService.signedRequest('POST', url, bodyData);
  }

  adminDashboardDetails(data: any) {
    const url = environment.baseUrl + 'admin/dashboardfilter';
    return this.securityService.signedRequest('POST', url, data);
  }

  adminDetails() {
    const url = environment.baseUrl + 'admin/details';
    return this.securityService.signedRequest('GET', url);
  }

  adminforgotpassword(data: any) {
    const url = environment.baseUrl + 'admin/forgotpassword';
    return this.securityService.signedRequest('POST', url, data);
  }

  changePassword(data: any) {
    const url = environment.baseUrl + 'admin/changePassword';
    return this.securityService.signedRequest('POST', url, data);
  }

  samepasswordcheck(data: any) {
    const url = environment.baseUrl + 'admin/checkSamePassword';
    return this.securityService.signedRequest('POST', url, data);
  }

  adminModuleList() {
    const url = environment.baseUrl + 'admin/listmodule';
    return this.securityService.signedRequest('GET', url);
  }

  subadminModuleList(data: any) {
    const url = environment.baseUrl + 'admin/listsubadminmodule';
    return this.securityService.signedRequest('POST', url, data);
  }


  subadminModuleupdate(data: any) {
    const url = environment.baseUrl + 'admin/assignmodule';
    return this.securityService.signedRequest('POST', url, data);
  }
}
