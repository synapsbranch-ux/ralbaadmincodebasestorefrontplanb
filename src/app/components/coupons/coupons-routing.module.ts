import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { AddCouponComponent } from './add-coupon/add-coupon.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';

const routes: Routes = [
  {
    path: 'list-coupons',
    component: CouponListComponent,canActivate: [AuthGuard],
    data: {
      title: "List Coupons",
      breadcrumb: "List Coupons"
    }
  },
  {
    path: 'add-coupon',
    component: AddCouponComponent,canActivate: [AuthGuard],
    data: {
      title: "Add Coupon",
      breadcrumb: "Add Coupon"
    }
  },
  {
    path: 'edit-coupon/:id',
    component: EditCouponComponent,canActivate: [AuthGuard],
    data: {
      title: "Edit Coupon",
      breadcrumb: "Edit Coupon"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
