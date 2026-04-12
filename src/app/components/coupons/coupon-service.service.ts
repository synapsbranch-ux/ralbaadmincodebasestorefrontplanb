import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';

@Injectable({
  providedIn: 'root'
})
export class CouponServiceService {

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  addCoupon(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/coupons/add';
    return this.securityService.signedRequest('POST', url, data);
  }

  fetchCoupons(page: number, pageSize: number): Observable<any>{  
    const url = environment.baseUrl+`admin/coupons/list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchCouponList(search: any) {
    const url = environment.baseUrl + `admin/coupons/search?search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }


  couponStatusChange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/coupons/statusChange';
    return this.securityService.signedRequest('POST', url, data);
  }

  couponWebsiteViewStatusChange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/coupons/websiteViewChange';
    return this.securityService.signedRequest('POST', url, data);
  }

  updateCoupon(coupon_id: string, data: any): Observable<any> {
    const url = environment.baseUrl + `admin/coupons/update/${coupon_id}`;
    return this.securityService.signedRequest('POST', url, data);
  }


  singleCouponDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/coupons/details';
    return this.securityService.signedRequest('POST', url, data);
  }
  

  getCouponUsageUsers(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/user/coupons/usageUsers';
    return this.securityService.signedRequest('POST', url, data);
  }



}
