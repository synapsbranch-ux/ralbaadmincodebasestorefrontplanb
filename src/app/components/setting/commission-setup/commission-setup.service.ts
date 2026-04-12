import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class CommissionSetupService {

  token:any;

  constructor( private http: HttpClient, private securityService: SecurityService)
  {

  }

  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////

  updateCommissionAdmin(data:any): Observable<any>{  
    const url = environment.baseUrl+'admin/commissionSetup';
    return this.securityService.signedRequest('POST', url, data);
  }

  getCommissionDetails(): Observable<any>{  
    const url = environment.baseUrl+'admin/getCommissionDeatils';
    return this.securityService.signedRequest('GET', url);
  }

}