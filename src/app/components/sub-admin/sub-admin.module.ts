import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { AddSubAdminComponent } from './add-sub-admin/add-sub-admin.component';
import { ListSubAdminComponent } from './list-sub-admin/list-sub-admin.component';
import { EditSubAdminComponent } from './edit-sub-admin/edit-sub-admin.component';
import { SubAdminRoutingModule } from './sub-admin-routing.module';
import { SubAdminService } from './sub-admin.service';
import { UpdateModuleAccessComponent } from './update-module-access/update-module-access.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [AddSubAdminComponent,ListSubAdminComponent,EditSubAdminComponent,UpdateModuleAccessComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubAdminRoutingModule,
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
  providers: [
    NgbActiveModal,
    SubAdminService
  ]
})
export class SubAdminModule { }
