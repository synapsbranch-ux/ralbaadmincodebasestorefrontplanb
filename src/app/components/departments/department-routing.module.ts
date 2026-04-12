import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';
import { ListDepartmentComponent } from './list-department/list-department.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-department',
        component: ListDepartmentComponent,canActivate: [AuthGuard],
        data: {
          title: "List Department",
          breadcrumb: "List Department"
        }
      },    
      {
        path: 'add-department',
        component: AddDepartmentComponent,canActivate: [AuthGuard],
        data: {
          title: "Add Department",
          breadcrumb: "Add Department"
        }
      }, 
      {
        path: 'edit-department/:id',
        component: EditDepartmentComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Department",
          breadcrumb: "Edit Department"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
