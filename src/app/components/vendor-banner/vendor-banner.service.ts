import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class VendorBannerService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'vendor/banner/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }


  allHomeBannerlist(): Observable<any> {
    const url = environment.baseUrl + 'vendor/banner/list';
    return this.securityService.signedRequest('GET', url);
  }

  addHomeBanner(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/banner/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleHomeBannerDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/banner/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleHomeBannerUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/banner/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  allsubCatagories() {
    const url = environment.baseUrl + 'vendor/all-subcategory';
    return this.securityService.signedRequest('GET', url);
  }

  allVendorBrands() {
    const url = environment.baseUrl + 'vandor/brand/list';
    return this.securityService.signedRequest('GET', url);
  }

  singleHomeBannerDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/banner/delete';
    return this.securityService.signedRequest('POST', url, data);
  }

}