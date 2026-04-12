import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from '@ag-grid-community/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  declarations: [OrdersComponent, TransactionsComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    AgGridAngular,
    NgxDatatableModule
  ]
})
export class SalesModule { }
