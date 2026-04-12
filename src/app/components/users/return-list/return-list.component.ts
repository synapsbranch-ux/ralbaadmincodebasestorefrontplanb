
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrderService } from '../../order-management/order.service';

@Component({
  selector: 'app-return-list',
  templateUrl: './return-list.component.html',
  styleUrl: './return-list.component.scss',
  providers: [DatePipe, CurrencyPipe, TitleCasePipe]
})
export class ReturnListComponent implements OnInit {

  userrole: any;
  isAdmin: boolean = false;
  orderData = [];
  totalOrder = 0;
  pageSize = 10;
  currentPage = 0;
  displayedColumns: string[];
  // displayedColumns: string[] = ['_id', 'product_image', 'payment_status','payment_method', 'order_status','createdAt','total_order_amount', 'actions'];
  dataSource = new MatTableDataSource<any>();
  vendorType: any;
  private startTime: number;
  private searchTimeout: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentUrl: string;
  constructor(private router: Router, private ngZone: NgZone, private orderservice: OrderService, private datePipe: DatePipe, private currencypipe: CurrencyPipe, private titlecase: TitleCasePipe, private toastrService: ToastrService) {

  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.orderList(this.currentPage, this.pageSize);
    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::", this.vendorType);

    this.displayedColumns = ['_id', 'product_image', 'payment_status', 'payment_method', 'order_status', 'createdAt', 'total_order_amount', 'actions'];

    this.currentUrl = this.router.url;
    localStorage.setItem('lastUrl', this.currentUrl);

  }


  orderList(page: number, pageSize: number) {
    this.orderservice.adminReturnOrderList(page + 1, pageSize).subscribe(
      res => {
        this.orderData = res['data'].orders;
        this.totalOrder = res['data'].totalOrders;
        this.dataSource.data = this.orderData.map(product => ({
          ...product,
          product_image: product.order_details.length > 0 ? product.order_details[0].product_image : 'assets/images/cat3.png'
        }));
        // console.log('All Order List',res['data']);
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    )
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    this.orderList(this.currentPage, this.pageSize);
  }


  // Trigger when user types in the search box
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();

    // Cancel the previous search if user keeps typing
    if (this.searchTimeout) {
      cancelAnimationFrame(this.searchTimeout);
    }

    // Record the start time
    this.startTime = performance.now();

    // Start checking the time with a custom timeout logic using requestAnimationFrame
    this.ngZone.runOutsideAngular(() => {
      const checkTime = (currentTime: number) => {
        const elapsedTime = currentTime - this.startTime;
        if (elapsedTime >= 2000) {  // 2 seconds delay
          this.ngZone.run(() => {
            if (filterValue.length > 2) {
              this.triggerSearch(filterValue);
            } else {
              this.orderList(this.currentPage, this.pageSize);
            }
          });
        } else {
          this.searchTimeout = requestAnimationFrame(checkTime);
        }
      };
      this.searchTimeout = requestAnimationFrame(checkTime);
    });
  }


  // Additional API request function for search
  triggerSearch(filterValue: string): void {
    this.orderservice.searchOrderList(filterValue).subscribe(res => {
      if (res && res['data']) {
        this.dataSource.data = res['data'].orders;
        this.totalOrder = res['data'].totalOrders;
      }
    });
  }

  view(orderDeatils) {
    this.router.navigate(['order/view-order/' + orderDeatils._id]);
  }

  statuschange(orderDeatils) {
    this.router.navigate(['order/order-status-change-return/' + orderDeatils._id]);
  }

}
