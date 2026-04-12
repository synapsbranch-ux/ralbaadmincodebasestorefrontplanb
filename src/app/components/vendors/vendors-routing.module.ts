import { ListVendorBannerAdminComponent } from './list-vendor-banner-admin/list-vendor-banner-admin.component';
import { EditVendorRoomComponent } from './edit-vendor-room/edit-vendor-room.component';
import { ListVendorRoomComponent } from './list-vendor-room/list-vendor-room.component';
import { ListVendorDepartmentComponent } from './list-vendor-department/list-vendor-department.component';
import { VendorOrderListComponent } from './vendor-order-list/vendor-order-list.component';
import { ViewVendorStoreComponent } from './view-vendor-store/view-vendor-store.component';

import { ListVendorStoreComponent } from './list-vendor-store/list-vendor-store.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';
import { CreateVendorsComponent } from './create-vendors/create-vendors.component';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { EditVendorStoreComponent } from './edit-vendor-store/edit-vendor-store.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { VendorProductListComponent } from './vendor-products-list/vendor-products-list.component';
import { EditVendorDepartmentComponent } from './edit-vendor-department/edit-vendor-department.component';
import { VendorTryonProductListComponent } from './vendor-tryon-products-list/vendor-tryon-products-list.component';
import { VendorPendingProductListComponent } from './vendor-pending-products-list/vendor-pending-products-list.component';
import { VendorApprovedProductListComponent } from './vendor-approved-products-list/vendor-approved-products-list.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-vendors',
        component: ListVendorsComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor List",
          breadcrumb: "Vendor List"
        }
      },
      {
        path: 'create-vendors',
        component: CreateVendorsComponent, canActivate: [AuthGuard],
        data: {
          title: "Create Vendor",
          breadcrumb: "Create Vendor"
        }
      },
      {
        path: 'edit-vendor/:id',
        component: EditVendorComponent, canActivate: [AuthGuard],
        data: {
          title: "Edit Vendor",
          breadcrumb: "Edit Vendor"
        }
      },
      {
        path: 'list-vendor-store/:id',
        component: ListVendorStoreComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Store List",
          breadcrumb: "Vendor Store List"
        }
      },
      {
        path: 'edit-vendor-store/:id',
        component: EditVendorStoreComponent, canActivate: [AuthGuard],
        data: {
          title: "Edit Vendor Store",
          breadcrumb: "Edit Vendor Store"
        }
      },
      {
        path: 'vendor-product-list/:id',
        component: VendorProductListComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Product List",
          breadcrumb: "Vendor Product List"
        }
      },
      {
        path: 'pending-product-list/:id',
        component: VendorPendingProductListComponent, canActivate: [AuthGuard],
        data: {
          title: "Pending Product List",
          breadcrumb: "Pending Product List"
        }
      },
      {
        path: 'approved-product-list/:id',
        component: VendorApprovedProductListComponent, canActivate: [AuthGuard],
        data: {
          title: "Approved Product List",
          breadcrumb: "Approved Product List"
        }
      },
      {
        path: 'vendor-tryon-product-list/:id',
        component: VendorTryonProductListComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Tryon Product List",
          breadcrumb: "Vendor Tryon Product List"
        }
      },
      {
        path: 'vendor-order-list/:id',
        component: VendorOrderListComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Order List",
          breadcrumb: "Vendor Order List"
        }
      },

      {
        path: 'vendor-department-list/:id',
        component: ListVendorDepartmentComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Department List",
          breadcrumb: "Vendor Department List"
        }
      },
      {
        path: 'vendor-edit-department/:id',
        component: EditVendorDepartmentComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Department Edit",
          breadcrumb: "Vendor Department Edit"
        }
      },
      {
        path: 'vendor-list-room/:id',
        component: ListVendorRoomComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Room List",
          breadcrumb: "Vendor Room List"
        }
      },
      {
        path: 'vendor-edit-room/:id',
        component: EditVendorRoomComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Edit Room",
          breadcrumb: "Vendor Edit Room"
        }
      },
      {
        path: 'vendor-banner-list/:id',
        component: ListVendorBannerAdminComponent, canActivate: [AuthGuard],
        data: {
          title: "Vendor Banner List",
          breadcrumb: "Vendor Banner List"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorsRoutingModule { }
