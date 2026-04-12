import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { ListBrandComponent } from './list-brand/list-brand.component';
import { EditBrandComponent } from './edit-brand/edit-brand.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { PlatformModule } from '@angular/cdk/platform';
import { BrandService } from './brand.service';
import { BrandRoutingModule } from './brand-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';

var maxImageWidth = 1000, maxImageHeight = 1000;

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: environment.baseUrl+'admin/brand/imageupload',
   maxFilesize: 10,
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
  declarations: [AddBrandComponent,ListBrandComponent,EditBrandComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrandRoutingModule,
    NgbModule,
    AgGridAngular,
    GalleryModule,
    DropzoneModule,
    MatDialogModule,
    PlatformModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
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
    BrandService
  ]
})
export class BrandModule { }
