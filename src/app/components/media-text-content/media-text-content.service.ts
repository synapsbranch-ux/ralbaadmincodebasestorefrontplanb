import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class MediaTextContentService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////


  allMediaTextContentlist(page: number, pageSize: number): Observable<any> {
    const url = environment.baseUrl + `admin/media-text-content/list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);

    const url = environment.baseUrl + 'admin/media-text-content/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  singleMediaTextContentDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/media-text-content/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  allTaglist() {
    const url = environment.baseUrl + 'admin/tag/list';
    return this.securityService.signedRequest('GET', url);
  }

  vendorallTaglist() {
    const url = environment.baseUrl + 'vendor/tag/list';
    return this.securityService.signedRequest('GET', url);
  }


  singleMediaTextContentAdd(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/media-text-content/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  updateMediaTextPostion(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/media-text-content-change-position';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleMediaTextContentUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/media-text-content/update';
    return this.securityService.signedRequest('POST', url, data);
  }



  /////////////////////////////////////////////////  API For VENDOR    //////////////////////////////////////////


  allVendorMediaTextContentlist(page: number, pageSize: number): Observable<any> {
    const url = environment.baseUrl + `vendor/media-text-content/list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  uploadVendorImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);

    const url = environment.baseUrl + 'vendor/media-text-content/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  singleVendorMediaTextContentDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/media-text-content/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleVendorMediaTextContentUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/media-text-content/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  updateVendorMediaTextPostion(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/media-text-content-change-position';
    return this.securityService.signedRequest('POST', url, data);
  }

}