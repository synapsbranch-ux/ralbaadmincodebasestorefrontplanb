import { Component, OnInit } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './shared/service/auth.service';
import { RoomsService } from './components/rooms/rooms.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

constructor(private authservice : AuthService,private roomservice: RoomsService )
{
  
}

ngOnInit() {
}


}
