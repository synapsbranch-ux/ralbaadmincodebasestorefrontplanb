import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';

@Injectable({
  providedIn: 'root'
})
export class ReturnDurationService {

  constructor(private http: HttpClient, private securityService: SecurityService) {

  }

  updateReturnDuration(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/returnDuration';
    return this.securityService.signedRequest('POST', url, data);
  }

  getReturnDuration(): Observable<any>{  
    const url = environment.baseUrl+'getReturnDuration';
    return this.securityService.signedRequest('GET', url);
  }
}
