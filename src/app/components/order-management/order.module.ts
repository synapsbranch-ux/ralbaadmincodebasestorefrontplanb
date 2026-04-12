import { OrderStatusChangeComponent } from './order-status-change/order-status-change.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';

import { OrderService } from './order.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OrderPaymentDetailsComponent } from './order-payment-details/order-payment-details.component';
import { ReturnListVendorComponent } from './return-list-vendor/return-list-vendor.component';
import { OrderStatusChangeReturnComponent } from './order-status-change-return/order-status-change-return.component';

@NgModule({
  declarations: [OrderListComponent,ViewOrderComponent,OrderStatusChangeComponent,OrderPaymentDetailsComponent, ReturnListVendorComponent, OrderStatusChangeReturnComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrderRoutingModule,
    NgbModule,
    AgGridAngular,
    GalleryModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  providers: [
    NgbActiveModal,
    OrderService
  ]
})
export class OrderModule { }
