import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class OrderService {
  token: any;
  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  allDepartment() {
    const url = environment.baseUrl + 'department';
    return this.securityService.signedRequest('GET', url);
  }

  singleOrderUpdateAdmin(data: any) {
    const url = environment.baseUrl + 'admin/orderUpdate';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleOrderDetailsAdmin(data: any) {
    const url = environment.baseUrl + 'admin/orderDetails';
    return this.securityService.signedRequest('POST', url, data);
  }

  adminReturnOrderList(page: number, pageSize: number) {
    const url = environment.baseUrl + `admin/returnOrderList?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }


  /////////////////////////////////  Vendor APIs ////////////////////////

  allOrderList(page: number, pageSize: number) {
    const url = environment.baseUrl + `vendor/orderList?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  returnOrderList(page: number, pageSize: number) {
    const url = environment.baseUrl + `vendor/returnOrderList?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchOrderList(search: any) {
    const url = environment.baseUrl + `vendor/orderSearch?search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  singleOrderDetails(data: any) {
    const url = environment.baseUrl + 'vendor/orderDetails';
    return this.securityService.signedRequest('POST', url, data);
  }

  adminsingleOrderDetails(data: any) {
    const url = environment.baseUrl + 'admin/user/orderDetails';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleOrderUpdate(data: any) {
    const url = environment.baseUrl + 'vendor/orderUpdate';
    return this.securityService.signedRequest('POST', url, data);
  }



  // Upload Prescription
  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    const url = environment.baseUrl + 'user/upload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  addonPrescriptionData(order_id: any, data: any): Observable<any> {
    const url = environment.baseUrl + `vendor/addonPrescriptionData/${order_id}`;
    return this.securityService.signedRequest('POST', url, data);
  }

  getCouponByOrderId(data: any) {
    const url = environment.baseUrl + 'admin/user/getCouponByOrderId';
    return this.securityService.signedRequest('POST', url, data);
  }


  
}