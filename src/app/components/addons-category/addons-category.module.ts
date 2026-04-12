import { MatDialogModule } from '@angular/material/dialog';
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
import { PlatformModule } from '@angular/cdk/platform';
import { AddonsCategoryService } from './addons-category.service';
import { AddonsCategoryRoutingModule } from './addons-category-routing.module';
import { ListAddonsCategoryComponent } from './list-addons-category/list-addons-category.component';
import { EditAddonsComponent } from './edit-addons/edit-addons.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
  declarations: [ListAddonsCategoryComponent,EditAddonsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddonsCategoryRoutingModule,
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
    MatInputModule
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
    AddonsCategoryService
  ]
})
export class AddonsCategoryModule { }
