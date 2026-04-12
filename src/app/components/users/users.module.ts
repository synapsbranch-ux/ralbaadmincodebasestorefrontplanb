import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AgGridAngular } from '@ag-grid-community/angular';
import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from './user.service';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserOrderListComponent } from './user-order-list/user-order-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReturnListComponent } from './return-list/return-list.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: environment.baseUrl+'admin/vendor/imageUpload',
   maxFilesize: 50,
   paramName:'image',
   acceptedFiles: 'image/jpeg,image/png,image/jpg',
   headers: {
    "Authorization":'Bearer ' + localStorage.getItem('user_token'),
  }
 };

@NgModule({
  declarations: [ListUserComponent, CreateUserComponent, EditUserComponent,UserOrderListComponent, ReturnListComponent],
  imports: [
    CommonModule,
    NgbModule,
    AgGridAngular,
    ReactiveFormsModule,
    UsersRoutingModule,
    DropzoneModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    UsersService
  ]
})
export class UsersModule { }
