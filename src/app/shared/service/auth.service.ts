import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Vendor } from '../_models/vendor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userToken:string ="";
  user_role:string

  constructor(private http: HttpClient, private router: Router) {

  }


  logout() {
    this.user_role = localStorage.getItem('user_role');
    console.log(localStorage.getItem('user_role'));
    if(this.user_role == 'admin')
    {

     localStorage.removeItem('user_id');
     localStorage.removeItem('user_token');
     localStorage.removeItem('user_role');
     localStorage.removeItem('currentUser');
     this.router.navigate(['login']);
    }

    if(this.user_role == 'vendor')
    {

     localStorage.removeItem('user_id');
     localStorage.removeItem('user_token');
     localStorage.removeItem('user_role');
     localStorage.removeItem('currentUser');
     localStorage.removeItem('store_date');
     localStorage.removeItem('vendor_type');
     this.router.navigate(['vendor-login']);
    }
  }
}
