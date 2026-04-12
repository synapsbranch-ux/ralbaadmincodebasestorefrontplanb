import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class UpdateShippingTaxService {

  token:any;

  constructor( private http: HttpClient, private securityService: SecurityService)
  {

  }

  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////

  updateShippingTaxAdmin(data:any): Observable<any>{  
    const url = environment.baseUrl+'admin/shippingTex';
    return this.securityService.signedRequest('POST', url, data);
  }

  getShippingTax(): Observable<any>{  
    const url = environment.baseUrl+'getShippingDeatils';
    return this.securityService.signedRequest('GET', url);
  }

  /////////////////////////////////////////////////  API For VENDOR    //////////////////////////////////////////

  updateShippingTaxVendor(data:any): Observable<any>{  
    const url = environment.baseUrl+'vendor/shippingTex';
    return this.securityService.signedRequest('POST', url, data);
  }




}