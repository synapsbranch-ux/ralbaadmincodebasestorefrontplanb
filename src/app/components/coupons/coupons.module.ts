import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { AddCouponComponent } from './add-coupon/add-coupon.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';


@NgModule({
  declarations: [CouponListComponent,AddCouponComponent, EditCouponComponent],
  imports: [
    CommonModule,
    CouponsRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ]
})
export class CouponsModule { }
