import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';


@Injectable({
  providedIn: 'root'
})

export class RoomsService {

  token: any;

  constructor(private http: HttpClient,  private securityService: SecurityService) {

  }

  /////////////////////////////////////////////////  API For ADMIN    //////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  allRoomlistAdmin() {
    const url = environment.baseUrl + 'admin/room/list';
    return this.securityService.signedRequest('GET', url);
  }

  singleRoomStatuschange(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/room/statuschange';
    return this.securityService.signedRequest('POST', url, data);
  }

  allDepartmentAdmin() {
    const url = environment.baseUrl + 'admin/department/list';
    return this.securityService.signedRequest('GET', url);
  }

  allRoomtextureAdmin() {
    const url = environment.baseUrl + 'admin/roomtexture/list';
    return this.securityService.signedRequest('GET', url);
  }
  singleRoomDetailsAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/room/details';
    return this.securityService.signedRequest('POST', url, data);
  }


  singleRoomUpdateAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/room/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleRoomDeleteAdmin(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/room/delete';
    return this.securityService.signedRequest('POST', url, data);
  }


  uploadImage(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    
    const url = environment.baseUrl + 'admin/roomtexture/imageUpload';
    return this.securityService.signedRequest('POST', url, formData);
  }

  addTexture(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/roomtexture/create';
    return this.securityService.signedRequest('POST', url, data);
  }

  textureDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/roomtexture/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  textureDetailsUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/roomtexture/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  textureDetailsDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'admin/roomtexture/delete';
    return this.securityService.signedRequest('POST', url, data);
  }

  /////////////////////////////////////////////////  API For VENDOR    //////////////////////////////////////////


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  allDepartment() {
    const url = environment.baseUrl + 'vender/department/list';
    return this.securityService.signedRequest('GET', url);
  }

  allRoomlist() {
    const url = environment.baseUrl + 'vender/room/list';
    return this.securityService.signedRequest('GET', url);
  }

  allRoomtexture() {
    const url = environment.baseUrl + 'vender/roomtexture/list';
    return this.securityService.signedRequest('GET', url);
  }

  addRooms(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/room/add';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleRoomDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/room/details';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleRoomUpdate(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/room/update';
    return this.securityService.signedRequest('POST', url, data);
  }

  singleRoomDelete(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/room/delete';
    return this.securityService.signedRequest('POST', url, data);
  }


  roomAvailableCheck(data: any): Observable<any> {
    const url = environment.baseUrl + 'vender/room/availlablity';
    return this.securityService.signedRequest('POST', url, data);
  }


}