import { ListHomeBannerComponent } from './list-home-banner/list-home-banner.component';
import { EditHomeBannerComponent } from './edit-home-banner/edit-home-banner.component';
import { AddHomeBannerComponent } from './add-home-banner/add-home-banner.component';
import { HomeBannerService } from './home-banner.service';
import { HomeBannerRoutingModule } from './home-banner-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';

var maxImageWidth = 1000, maxImageHeight = 1000;

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
  declarations: [AddHomeBannerComponent,EditHomeBannerComponent,ListHomeBannerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeBannerRoutingModule,
    NgbModule,
    AgGridAngular,
    GalleryModule,
    DropzoneModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],

  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    NgbActiveModal,
    HomeBannerService
  ]
})
export class HomeBannerModule { }
