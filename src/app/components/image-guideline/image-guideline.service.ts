import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class ImageGuidlineService {

  token: any;

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  allImageinstlistAdmin(): Observable<any> {
    const url = environment.baseUrl + 'admin/imageinst/list';
    return this.securityService.signedRequest('GET', url);
  }



  singleImageinstDetailsAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/imageinst/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleStoreUpdateAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/imageinst/update';
    return this.securityService.signedRequest('POST', url, data);
  }

}