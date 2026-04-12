import { UpdateModuleAccessComponent } from './update-module-access/update-module-access.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { AddSubAdminComponent } from './add-sub-admin/add-sub-admin.component';
import { EditSubAdminComponent } from './edit-sub-admin/edit-sub-admin.component';
import { ListSubAdminComponent } from './list-sub-admin/list-sub-admin.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-sub-admin',
        component: ListSubAdminComponent,canActivate: [AuthGuard],
        data: {
          title: "Subadmin List",
          breadcrumb: "Subadmin List"
        }
      },    
      {
        path: 'add-sub-admin',
        component: AddSubAdminComponent,canActivate: [AuthGuard],
        data: {
          title: "Create Subadmin",
          breadcrumb: "Create Subadmin"
        }
      }, 
      {
        path: 'edit-sub-admin/:id',
        component: EditSubAdminComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Sub Admin",
          breadcrumb: "Edit Sub Admin"
        }
      },   
      {
        path: 'module-access/:id',
        component: UpdateModuleAccessComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Module Access",
          breadcrumb: "Edit Module Access"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAdminRoutingModule { }
