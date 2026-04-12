import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Vendor } from 'src/app/shared/_models/vendor';
import { SecurityService } from 'src/security.service';
// import { AnySrvRecord } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private currentUserSubject: BehaviorSubject<Vendor>;
  token: any;

  constructor(private http: HttpClient,  private securityService: SecurityService) {


  }


  vendorLogin(data) {
    const url = environment.baseUrl + 'vendor/login';
    return this.securityService.signedRequest('POST', url, data);
  }

  vendorSignUp(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/signup';
    return this.securityService.signedRequest('POST', url, data);
  }

  vendorgenerateOTP(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/generateOTP';
    return this.securityService.signedRequest('POST', url, data);
  }

  vendorDetails() {
    const url = environment.baseUrl + 'vendor/details';
    return this.securityService.signedRequest('GET', url);
  }

  vendorDashboardDetails(data: any) {
    const url = environment.baseUrl + 'vendor/dashboardfilter';
    return this.securityService.signedRequest('POST', url, data);
  }

  vendorforgotpassword(data: any) {
    const url = environment.baseUrl + 'vendor/forgotpassword';
    return this.securityService.signedRequest('POST', url, data);
  }

  changePassword(data: any) {
    const url = environment.baseUrl + 'vendor/changePassword';
    return this.securityService.signedRequest('POST', url, data);
  }

  samepasswordcheck(data: any) {
    const url = environment.baseUrl + 'vendor/checkSamePassword';
    return this.securityService.signedRequest('POST', url, data);
  }

}
