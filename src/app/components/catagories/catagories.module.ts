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
import { CatagoriesService } from './catagories.service';
import { CatagoriesRoutingModule } from './catagories-routing.module';
import { AddCatagoriesComponent } from './add-catagories/add-catagories.component';
import { EditCatagoriesComponent } from './edit-catagories/edit-catagories.component';
import { ListCatagoriesComponent } from './list-catagories/list-catagories.component';
import { ListSubCatagoriesComponent } from './list-sub-catagories/list-sub-catagories.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ListAttributeComponent } from './list-attribute/list-attribute.component';
import { ListAttributeVerientComponent } from './list-attribute-verient/list-attribute-verient.component';
import { ListAddonsComponent } from './list-addons/list-addons.component';
import { ListAddonsVerientComponent } from './list-addons-verient/list-addons-verient.component';
import { ViewChildSubCatagoriesBtnComponent } from './view-child-sub-catagories/view-child-sub-catagories.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

var maxImageWidth = 1000, maxImageHeight = 1000;

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: environment.baseUrl+'admin/catagories/upload-image',
   maxFilesize: 50,
   paramName:'image',
   acceptedFiles: 'image/jpeg,image/png,image/jpg',
   addRemoveLinks: true,
   autoProcessQueue: false,
  //  thumbnailWidth: 1000,
  //  thumbnailHeight: 1000,
   headers: {
    "Authorization":'Bearer ' + localStorage.getItem('user_token'),
  }
 };

@NgModule({
  declarations: [AddCatagoriesComponent,EditCatagoriesComponent,ListCatagoriesComponent,ListSubCatagoriesComponent, ListAttributeComponent, ListAttributeVerientComponent,ListAddonsComponent,ListAddonsVerientComponent,ViewChildSubCatagoriesBtnComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CatagoriesRoutingModule,
    NgbModule,
    AgGridAngular,
    GalleryModule,
    DropzoneModule,
    MatDialogModule,
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
    CatagoriesService
  ]
})
export class CatagoriesModule { }
