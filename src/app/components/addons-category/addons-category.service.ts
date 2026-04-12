import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class AddonsCategoryService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  allCategoriesList(): Observable<any> {
    const url = environment.baseUrl + 'vendor/category-list';
    return this.securityService.signedRequest('GET', url);
  }


  singleCategoryDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'vendor/category-details';
    return this.securityService.signedRequest('POST', url, data);
  }

  categoryAddonsDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/addon/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleCategoryUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/addon/create';
    return this.securityService.signedRequest('POST', url, data);
  }

}