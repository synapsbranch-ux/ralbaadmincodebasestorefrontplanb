import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class StoreService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  allStorelistAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleStoreDeleteAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/delete';
    return this.securityService.signedRequest('POST', url, data);
  }


  singleStoreStatuschange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/statuschange';
    return this.securityService.signedRequest('POST', url, data);
  }


  singleStoreDetailsAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleStoreUpdateAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/store/update';
    return this.securityService.signedRequest('POST', url, data);
  }


  /////////////////////////////////////////////////  API For VENDOR    //////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'vendor/store/imageupload';
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


  allStorelist(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/list';
    return this.securityService.signedRequest('POST', url, data);
  }

  addStores(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/store/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleStoreDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleStoreUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  addNewRoomInStore(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/duplicate';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleStoreDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/delete';
    return this.securityService.signedRequest('POST', url, data);
  }

  storeImageDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/store/imagedelete';
    return this.securityService.signedRequest('POST', url, data);
  }

}