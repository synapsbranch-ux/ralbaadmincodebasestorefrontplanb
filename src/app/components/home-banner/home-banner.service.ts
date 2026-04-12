import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class HomeBannerService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);

    const url = environment.baseUrl + 'admin/banner/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }


  allHomeBannerlist(): Observable<any> {
    const url = environment.baseUrl + 'admin/banner/list';
    return this.securityService.signedRequest('GET', url);
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

  allCatagories() {
    const url = environment.baseUrl + 'category';
    return this.securityService.signedRequest('GET', url);
  }

  allDepartmentList(data) {
    const url = environment.baseUrl + 'admin/banner/department-list';
    return this.securityService.signedRequest('POST', url, data);
  }

}