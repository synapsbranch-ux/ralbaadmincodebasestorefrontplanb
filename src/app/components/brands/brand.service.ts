import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class BrandService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////


  allbrandlist(page: number, pageSize: number): Observable<any> {
    const url = environment.baseUrl + `admin/brand/list?page=${page}&limit=${pageSize}`;
    return this.securityService.signedRequest('GET', url);
  }

  searchBrandlist(search: any): Observable<any> {
    const url = environment.baseUrl + `admin/brand/search?search=${search}`;
    return this.securityService.signedRequest('GET', url);
  }

  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);

    const url = environment.baseUrl + 'admin/brand/imageupload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  singleBrandDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/brand/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleBrandAdd(data: any): Observable<any> { 
    const url = environment.baseUrl + 'admin/brand/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleBrandUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/brand/update';
    return this.securityService.signedRequest('POST', url, data);
  }

}