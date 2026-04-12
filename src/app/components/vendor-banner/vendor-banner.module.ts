import { MatDialogModule } from '@angular/material/dialog';
import { ListVendorBannerComponent } from './list-vendor-banner/list-vendor-banner.component';
import { EditVendorBannerComponent } from './edit-vendor-banner/edit-vendor-banner.component';
import { AddVendorBannerComponent } from './vendor-add-banner/add-vendor-banner.component';
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
import { VendorBannerService } from './vendor-banner.service';
import { VendorBannerRoutingModule } from './vendor-banner-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: environment.baseUrl+'vendor/banner/imageupload',
   maxFilesize: 50,
   paramName:'image',
   acceptedFiles: 'image/jpeg,image/png,image/jpg,image/gif',
   addRemoveLinks: true,
   autoProcessQueue: false,
   headers: {
    "Authorization":'Bearer ' + localStorage.getItem('user_token'),
  }
 };

@NgModule({
  declarations: [AddVendorBannerComponent,EditVendorBannerComponent,ListVendorBannerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VendorBannerRoutingModule,
    NgbModule,
    AgGridAngular,
    GalleryModule,
    DropzoneModule,
    MatDialogModule,
    NgSelectModule
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
    VendorBannerService
  ]
})
export class VendorBannerModule { }
