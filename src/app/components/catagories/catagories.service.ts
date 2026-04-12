import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class CatagoriesService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);

    const url = environment.baseUrl + 'admin/banner/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  allCatagorieslistFilter(page: any, pageSize: any): Observable<any> {
    const url = environment.baseUrl + `admin/category-list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchCategorylist(search: any): Observable<any> {
    const url = environment.baseUrl + `admin/search-category?search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  allCatagorieslist(): Observable<any> {
    const url = environment.baseUrl + `admin/category-list`;
    return this.securityService.signedRequest('GET', url);
  }

  allSubCatagorieslist(subobj: any): Observable<any> {
    const url = environment.baseUrl + 'admin/sub-category-list';
    return this.securityService.signedRequest('POST', url, subobj);
  }

  allChildSubCatagorieslist(childsubcat: any): Observable<any> {
    const url = environment.baseUrl + 'admin/child-sub-category-list';
    return this.securityService.signedRequest('POST', url, childsubcat);
  }

  addHomeBanner(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/banner/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleHomeBannerDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/banner/details';
    return this.securityService.signedRequest('POST', url, data);    
  }

  singleHomeBannerUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/banner/update';
    return this.securityService.signedRequest('POST', url, data);    
  }

  singleHomeBannerDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/banner/delete';
    return this.securityService.signedRequest('POST', url, data);
  }

  allStores() {
    const url = environment.baseUrl + 'admin/banner/store-list';
    return this.securityService.signedRequest('GET', url);    
  }

  allDepartmentList(data) {
    const url = environment.baseUrl + 'admin/banner/department-list';
    return this.securityService.signedRequest('POST', url, data);    
  }

  addCatagories(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/category/create';
    return this.securityService.signedRequest('POST', url, data);    
  }

  updateCatagories(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/category/update';
    return this.securityService.signedRequest('POST', url, data); 
  }

  addSubCatagories(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/sub-category/create';
    return this.securityService.signedRequest('POST', url, data); 
  }

  udateSubCatagories(data: any): Observable<any> {  
    const url = environment.baseUrl + 'admin/sub-category/update';
    return this.securityService.signedRequest('POST', url, data); 
  }

  updateChildSubCatagories(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/child-sub-category/update';
    return this.securityService.signedRequest('POST', url, data); 
  }

  addChildSubCatagories(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/child-sub-category/create';
    return this.securityService.signedRequest('POST', url, data); 
  }

  singleCatagoriesDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/category/delete';
    return this.securityService.signedRequest('POST', url, data); 
  }

  singleChildSubCatagoriesDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/child-sub-category/delete';
    return this.securityService.signedRequest('POST', url, data); 
  }


  singleSubCatagoriesDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/sub-category/delete';
    return this.securityService.signedRequest('POST', url, data); 
  }

  singleChildSubCatagoriesDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/child-sub-category/details';
    return this.securityService.signedRequest('POST', url, data); 
  }

  singleSubCatagoriesDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/sub-category/details';
    return this.securityService.signedRequest('POST', url, data); 
  }
  singleCatagoriesDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/category/details';
    return this.securityService.signedRequest('POST', url, data); 
  }

}