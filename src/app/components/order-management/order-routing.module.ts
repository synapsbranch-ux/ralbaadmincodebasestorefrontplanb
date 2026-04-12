import { OrderStatusChangeComponent } from './order-status-change/order-status-change.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { ViewOrderComponent } from './view-order/view-order.component';
import { OrderPaymentDetailsComponent } from './order-payment-details/order-payment-details.component';
import { venortypeauthGuard } from '../auth/_service/venortypeauth.guard';
import { ReturnListVendorComponent } from './return-list-vendor/return-list-vendor.component';
import { OrderStatusChangeReturnComponent } from './order-status-change-return/order-status-change-return.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'order-list',
        component: OrderListComponent,canActivate: [AuthGuard],
        data: {
          title: "Order List",
          breadcrumb: "Order list"
        }
      }, 
      {
        path: 'return-list',
        component: ReturnListVendorComponent,canActivate: [AuthGuard],
        data: {
          title: "Return List",
          breadcrumb: "Return list"
        }
      },      
      {
        path: 'view-order/:id',
        component: ViewOrderComponent,canActivate: [AuthGuard],
        data: {
          title: "View-Order",
          breadcrumb: "view-order"
        }
      },   
      {
        path: 'order-status-change/:id',
        component: OrderStatusChangeComponent,canActivate: [AuthGuard,venortypeauthGuard],
        data: {
          title: "Order Status Change",
          breadcrumb: "Order Status Change"
        }
      },
      {
        path: 'order-status-change-return/:id',
        component: OrderStatusChangeReturnComponent,canActivate: [AuthGuard,venortypeauthGuard],
        data: {
          title: "Order Status Change Return",
          breadcrumb: "Order Status Change Return"
        }
      },

      {
        path: 'order-payment-details/:id',
        component: OrderPaymentDetailsComponent,canActivate: [AuthGuard,venortypeauthGuard],
        data: {
          title: "Order payment details",
          breadcrumb: "Order payment details"
        }
      },
        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
