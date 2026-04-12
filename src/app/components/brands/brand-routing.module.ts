import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { EditBrandComponent } from './edit-brand/edit-brand.component';
import { ListBrandComponent } from './list-brand/list-brand.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-brand',
        component: ListBrandComponent,canActivate: [AuthGuard],
        data: {
          title: "Brand List",
          breadcrumb: "Brand List"
        }
      },    
      {
        path: 'add-brand',
        component: AddBrandComponent,canActivate: [AuthGuard],
        data: {
          title: "Add Brand",
          breadcrumb: "Add Brand"
        }
      }, 
      {
        path: 'edit-brand/:id',
        component: EditBrandComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Brand",
          breadcrumb: "Edit Brand"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
