import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Vendor } from 'src/app/shared/_models/vendor';
import { SecurityService } from 'src/security.service';



@Injectable({
  providedIn: 'root'
})

export class ProductService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {


  }

  // Admin Product Services

  updateProductsByAdmin(data: any): Observable<any> {
    // this.token = localStorage.getItem('user_token') // Will return if it is not set 

    // this.token = "Bearer " + this.token
    // let httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': this.token
    //   })
    // }

    const url = environment.baseUrl + 'admin/vender/product/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  statusChangeProductsByAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vender/product/statusChange';
    return this.securityService.signedRequest('POST', url, data);
  }


  bulkstatusChangeProductsByAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vender/product/bulkstatusChange';
    return this.securityService.signedRequest('POST', url, data);
  }


  allStoresByAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  allDepartmentByAdmin() {
    const url = environment.baseUrl + 'admin/department/list';
    return this.securityService.signedRequest('GET', url);
  }


  // Vendor Product Service

  allStores(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  allDepartment() {
    const url = environment.baseUrl + 'vender/department/list';
    return this.securityService.signedRequest('GET', url);
  }


  allBrands(category_id: any) {
    const url = environment.baseUrl + `admin/brand/list?category_id=${category_id}`;
    return this.securityService.signedRequest('GET', url);  
  }

  allCatagories() {
    const url = environment.baseUrl + 'category';
    return this.securityService.signedRequest('GET', url);
  }

  allVarientlist() {
    const url = environment.baseUrl + 'varient/list'
    return this.securityService.signedRequest('GET', url);
  }

  allCopyVendorList(page: number, pageSize: number) {
    const url = environment.baseUrl + `vendor/copy-vendor-list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }


  allAdminTaglist() {
    const url = environment.baseUrl + 'admin/tag/list';
    return this.securityService.signedRequest('GET', url);
  }

  allTaglist() {
    const url = environment.baseUrl + 'vender/tag/list';
    return this.securityService.signedRequest('GET', url);
  }


  cloneAllProducts() {
    const url = environment.baseUrl + 'vender/product-copy-form-library';
    return this.securityService.signedRequest('GET', url);
  }


  allProductlist(page: number, pageSize: number) {
    const url = environment.baseUrl + `vender/product/list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchProductlist(search: any) {
    const url = environment.baseUrl + `vender/product/search?search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  allPendingProductlist(page: number, pageSize: number) {
    const url = environment.baseUrl + `access-vendor/pending-list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  allApprovedProductlist(page: number, pageSize: number) {
    const url = environment.baseUrl + `access-vendor/approve-list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  statusChangeGLBPendingProducts(data: any) {
    const url = environment.baseUrl + 'access-vendor/product-activation';
    return this.securityService.signedRequest('POST', url, data);
  }

  addProducts(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/product/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  searchProductSKU(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/product/skucheck';
    return this.securityService.signedRequest('POST', url, data);
  }

  deleteProductsImage(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/product/image-delete';
    return this.securityService.signedRequest('POST', url, data);
  }

  deleteProductsImageServer(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/product/image-delete-server';
    return this.securityService.signedRequest('POST', url, data);
  }

  getproductsBySlugs(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/product/' + data;
    return this.securityService.signedRequest('GET', url);
  }

  updateProducts(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/product/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  allSubCatagorieslist(subobj: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/sub-category-list';
    return this.securityService.signedRequest('POST', url, subobj);
  }


  allChildSubCatagorieslist(childsubcat: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/child-sub-category-list';
    return this.securityService.signedRequest('POST', url, childsubcat);
  }


  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);

    const url = environment.baseUrl + 'vender/product/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  uploadGlb(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'vender/product/glbupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  vendorDeleteProducts(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/product/delete';
    return this.securityService.signedRequest('POST', url, data);
  }

  adminDeleteProducts(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/vender/product/delete';
    return this.securityService.signedRequest('POST', url, data);
  }


  request3DAsset(data: any): Observable<any> {
    const url = environment.baseUrl + 'request-for-3d-asset';
    return this.securityService.signedRequest('POST', url, data);
  }

  // Plan B Multi-Store
  getPlatformAllProducts(data: any): Observable<any> {
    const url = environment.baseUrl + 'products/platform-all';
    return this.securityService.signedRequest('POST', url, data);
  }

  updateDisplayerFulfiller(productId: string, data: any): Observable<any> {
    const url = environment.baseUrl + `products/${productId}/displayer-fulfiller`;
    return this.securityService.signedRequest('PATCH', url, data);
  }

  getPendingDisplayerFulfillers(): Observable<any> {
    const url = environment.baseUrl + 'admin/products/displayer-fulfiller/pending';
    return this.securityService.signedRequest('GET', url);
  }

  updateAdminDisplayerFulfillerStatus(productId: string, vendorId: string, data: any): Observable<any> {
    const url = environment.baseUrl + `admin/products/${productId}/displayer-fulfiller/${vendorId}`;
    return this.securityService.signedRequest('PATCH', url, data);
  }

}
