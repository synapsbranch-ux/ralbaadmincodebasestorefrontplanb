import { ListVendorBannerAdminComponent } from './list-vendor-banner-admin/list-vendor-banner-admin.component';
import { VendorActionBtnComponent } from './vendor-action-btn/vendor-action-btn.component';
import { AgGridAngular } from '@ag-grid-community/angular';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { EditVendorRoomComponent } from './edit-vendor-room/edit-vendor-room.component';
import { ListVendorRoomComponent } from './list-vendor-room/list-vendor-room.component';
import { ListVendorDepartmentComponent } from './list-vendor-department/list-vendor-department.component';
import { VendorOrderListComponent } from './vendor-order-list/vendor-order-list.component';
import { EditVendorStoreComponent } from './edit-vendor-store/edit-vendor-store.component';

import { ListVendorStoreComponent } from './list-vendor-store/list-vendor-store.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { VendorsService } from './vendor.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';
import { CreateVendorsComponent } from './create-vendors/create-vendors.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { VendorProductListComponent } from './vendor-products-list/vendor-products-list.component'
import { EditVendorDepartmentComponent } from './edit-vendor-department/edit-vendor-department.component';
import { VendorTryonProductListComponent } from './vendor-tryon-products-list/vendor-tryon-products-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { VendorPendingProductListComponent } from './vendor-pending-products-list/vendor-pending-products-list.component';
import { VendorApprovedProductListComponent } from './vendor-approved-products-list/vendor-approved-products-list.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: environment.baseUrl+'admin/vendor/imageUpload',
   maxFilesize: 50,
   paramName:'image',
   acceptedFiles: 'image/jpeg,image/png,image/jpg',
   addRemoveLinks: true,
   headers: {
    "Authorization":'Bearer ' + localStorage.getItem('user_token'),
  }
 };

@NgModule({
  declarations: [VendorOrderListComponent,ListVendorDepartmentComponent,EditVendorDepartmentComponent,ListVendorRoomComponent,EditVendorRoomComponent ,ListVendorsComponent, CreateVendorsComponent,EditVendorComponent,ListVendorStoreComponent,EditVendorStoreComponent,VendorProductListComponent,VendorActionBtnComponent,ListVendorBannerAdminComponent,VendorTryonProductListComponent,VendorPendingProductListComponent, VendorApprovedProductListComponent ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    DropzoneModule,
    CarouselModule,
    AgGridAngular,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    VendorsService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class VendorsModule { }
