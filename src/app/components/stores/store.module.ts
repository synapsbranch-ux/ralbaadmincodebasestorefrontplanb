import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { StoreService } from './store.service';
import { StoreRoutingModule } from './store-routing.module';
import { AddStoreComponent } from './add-store/add-store.component';
import { ListStoreComponent } from './list-store/list-store.component';
import { EditStoreComponent } from './edit-store/edit-store.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { PlatformModule } from '@angular/cdk/platform';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';

var maxImageWidth = 1000, maxImageHeight = 1000;

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: environment.baseUrl + 'vendor/store/imageupload',
  maxFilesize: 50,
  paramName: 'image',
  acceptedFiles: 'image/jpeg,image/png,image/jpg',
  addRemoveLinks: true,
  //  thumbnailWidth: 1000,
  //  thumbnailHeight: 1000,
  headers: {
    "Authorization": 'Bearer ' + localStorage.getItem('user_token'),
  }
};

@NgModule({
  declarations: [AddStoreComponent, ListStoreComponent, EditStoreComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreRoutingModule,
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
    StoreService
  ]
})
export class StoreModule { }
