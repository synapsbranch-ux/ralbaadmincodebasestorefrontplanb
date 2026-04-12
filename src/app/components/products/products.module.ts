import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from '@ag-grid-community/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductsRoutingModule } from './products-routing.module';
import { GalleryModule } from '@ks89/angular-modal-gallery';

import 'hammerjs';
import 'mousetrap';

import { environment } from 'src/environments/environment';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ProductService } from './product.service';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductListComponent } from './products-list/product-list.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { EditProductComponent } from './edit-product/editproduct.component';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PendingProductListComponent } from './pending-products-list/pending-products-list.component';
import { ApproveProductListComponent } from './approve-products-list/approve-products-list.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: environment.baseUrl + 'vender/product/imageupload',
  maxFilesize: 50,
  paramName: 'image',
  acceptedFiles: 'image/jpeg,image/png,image/jpg',
  addRemoveLinks: true,
  autoProcessQueue: false,
  headers: {
    "Authorization": 'Bearer ' + localStorage.getItem('user_token'),
  }
};



@NgModule({
  declarations: [ProductCategoryComponent, EditCategoriesComponent, ProductListComponent, ProductAddComponent, EditProductComponent, PendingProductListComponent,ApproveProductListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    ProductsRoutingModule,
    AgGridAngular,
    NgbModule,
    DropzoneModule,
    GalleryModule,
    MatDialogModule,
    DragDropModule,
    NgSelectModule,
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
    ProductService
  ]
})
export class ProductsModule { }
