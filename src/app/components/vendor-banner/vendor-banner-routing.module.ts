import { EditVendorBannerComponent } from './edit-vendor-banner/edit-vendor-banner.component';

import { ListVendorBannerComponent } from './list-vendor-banner/list-vendor-banner.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { AddVendorBannerComponent } from './vendor-add-banner/add-vendor-banner.component';
import { venortypeauthGuard } from '../auth/_service/venortypeauth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-vendor-banner',
        component: ListVendorBannerComponent,canActivate: [AuthGuard],
        data: {
          title: "List Vendor Banner",
          breadcrumb: "List Vendor Banner"
        }
      },    
      {
        path: 'add-vendor-banner',
        component: AddVendorBannerComponent,canActivate: [AuthGuard],
        data: {
          title: "Add Vendor Banner",
          breadcrumb: "Add Vendor Banner"
        }
      }, 
      {
        path: 'edit-vendor-banner/:id',
        component: EditVendorBannerComponent,canActivate: [AuthGuard,venortypeauthGuard],
        data: {
          title: "Edit Vendor Banner",
          breadcrumb: "Edit Vendor Banner"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorBannerRoutingModule { }
