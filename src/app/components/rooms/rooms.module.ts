import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { RoomRoutingModule } from './rooms-routing.module';
import { AddRoomComponent } from './addroom/add-room.component';
import { ListRoomComponent } from './list-room/list-room.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { ListRoomTextureComponent } from './list-room-texture/list-room-texture.component';
import { RoomsService } from './rooms.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AddRoomTextureComponent } from './addroom-texture/addroom-texture.component'
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { EditRoomTextureComponent } from './editroom-texture/editroom-texture.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: environment.baseUrl+'vendor/store/imageupload',
   maxFilesize: 50,
   paramName:'image',
   acceptedFiles: 'image/jpeg,image/png,image/jpg',
   addRemoveLinks: true,
  //  thumbnailWidth: 1000,
  //  thumbnailHeight: 1000,
   headers: {
    "Authorization":'Bearer ' + localStorage.getItem('user_token'),
  }
 };

@NgModule({
  declarations: [AddRoomComponent,ListRoomComponent,EditRoomComponent,ListRoomTextureComponent,AddRoomTextureComponent,EditRoomTextureComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoomRoutingModule,
    NgbModule,
    AgGridAngular,
    GalleryModule,
    CarouselModule,
    DropzoneModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    NgbActiveModal,
    RoomsService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class RoomsModule { }
