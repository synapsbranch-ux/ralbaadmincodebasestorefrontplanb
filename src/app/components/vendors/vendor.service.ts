import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class VendorsService {

  token: any;

  constructor(private http: HttpClient,  private securityService: SecurityService) {

  }

  allVendorList(page: number, pageSize: number) {
    const url = environment.baseUrl + `admin/vendor/list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchVendorlist(search: any) {
    const url = environment.baseUrl + `admin/vendor/search?search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  vendorStatuschange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/statusChange';
    return this.securityService.signedRequest('POST', url, data);
  }

  addVendor(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleVendorDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/details';
    return this.securityService.signedRequest('POST', url, data);
  }

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


  addNewRoomInStore(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/duplicate';
    return this.securityService.signedRequest('POST', url, data);
  }


  storeStatusChanageAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  getProductListByVendor(vendor_id: any, page: number, pageSize: number): Observable<any> {
    const url = environment.baseUrl + `admin/vendor/product/list?vendor_id=${vendor_id}&page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchProductlist(search: any, vendor_id: any) {
    const url = environment.baseUrl + `admin/vender/product/search?vendor_id=${vendor_id}&search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  getTryonProductListByVendor(vendor_id: any, page: number, pageSize: number): Observable<any> {
    const url = environment.baseUrl + `admin/vendor/tryon-product/list?vendor_id=${vendor_id}&page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  /////All Order Related API  Start ////////////////

  allOrderList(data: any) {
    const url = environment.baseUrl + 'admin/vendor/orderList';
    return this.securityService.signedRequest('POST', url, data);
  }

  searchOrderList(search: any, vendor_id: any) {
    const url = environment.baseUrl + `admin/vendor/orderSearch?vendor_id=${vendor_id}&search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  singleOrderDetails(data: any) {
    const url = environment.baseUrl + 'admin/vendor/orderDetails';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleOrderUpdate(data: any) {
    const url = environment.baseUrl + 'admin/vendor/orderUpdate';
    return this.securityService.signedRequest('POST', url, data);
  }

  /////All Order Related API  End ////////////////

  /////All Department Related API  Start ////////////////

  /// admin department list by Vendor Wise
  allDepartmentAdmin(data) {
    const url = environment.baseUrl + 'admin/vendor/department/list';
    return this.securityService.signedRequest('POST', url, data);
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
    const url = environment.baseUrl + 'admin/vendor/department/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  allStorelistVendorAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/store/list';
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

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'admin/department/imageUpload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  uploadGlbfile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'admin/store/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  uploadJpgImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'vendor/store/jpg-imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  uploadLogoImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'vendor/store/logo-imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  singleStoreDetailsAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/details';
    return this.securityService.signedRequest('POST', url, data);
  }


  uploadImageStore(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'admin/store/imageUpload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  /////All Department Related API  End ////////////////

  /////All Room Related API  Start ////////////////


  singleRoomStatuschange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/room/statuschange';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleRoomDeleteAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/room/delete';
    return this.securityService.signedRequest('POST', url, data);
  }

  allRoomlistVendorAdmin(data) {
    const url = environment.baseUrl + 'admin/vendor/room/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  allRoomtextureAdmin() {
    const url = environment.baseUrl + 'admin/roomtexture/list';
    return this.securityService.signedRequest('GET', url);
  }

  singleRoomDetailsAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/room/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleRoomUpdateAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/room/update';
    return this.securityService.signedRequest('POST', url, data);
  }


  allHomeBannerlist(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/banner/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  vendorBannerStatusChange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vendor/banner/statuschange';
    return this.securityService.signedRequest('POST', url, data);
  }

  allAdminPendingProductlist(page: any, limit: any, vendor_id: any): Observable<any> {
    const url = environment.baseUrl + `admin/access-vendor/pending-list?page=${page}&limit=${limit}&vendor_id=${vendor_id}`;
    return this.securityService.signedRequest('GET', url);
  }

  allAdminApprovedProductlist(page: any, limit: any, vendor_id: any): Observable<any> {
    const url = environment.baseUrl + `admin/access-vendor/approve-list?page=${page}&limit=${limit}&vendor_id=${vendor_id}`;
    return this.securityService.signedRequest('GET', url);
  }

  statusChangeGLBPendingProducts(data: any) {
    const url = environment.baseUrl + 'admin/access-vendor/product-activation';
    return this.securityService.signedRequest('POST', url, data);
  }

}