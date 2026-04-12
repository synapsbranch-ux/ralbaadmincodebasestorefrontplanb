import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuard } from '../auth/_service/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'orders',
        component: OrdersComponent,canActivate: [AuthGuard],
        data: {
          title: "Orders",
          breadcrumb: "Orders"
        }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,canActivate: [AuthGuard],
        data: {
          title: "Transactions",
          breadcrumb: "Transactions"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
