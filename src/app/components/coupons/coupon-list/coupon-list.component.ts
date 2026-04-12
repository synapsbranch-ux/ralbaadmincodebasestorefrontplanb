import { UserViewOrderBtnComponent } from '../../users/user-view-order-btn/user-view-order-btn.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../users/user.service';
import { UserStatusChangeComponent } from '../../users/user-status-change/user-status-change.component';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CouponServiceService } from '../coupon-service.service';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrl: './coupon-list.component.scss',
  providers: [DatePipe]
})

export class CouponListComponent implements OnInit {
  userrole: any;
  isAdmin: boolean = false;
  couponlist: any[] = [];
  totalCoupons = 0;
  pageSize = 10;
  currentPage = 0;
  displayedColumns: string[] = ['coupon_name', 'coupon_code', 'discount', 'min_order_amount', 'validity', 'usage', 'web_view_status', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  private startTime: number;
  private searchTimeout: any;
  showCouponUsedUsersModal = false;
  couponUsedUserslist: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private couponService: CouponServiceService, private datePipe: DatePipe, private ngZone: NgZone, private router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
      this.fetchCoupons(this.currentPage, this.pageSize);
    }

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
              this.fetchCoupons(this.currentPage, this.pageSize);
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
    this.couponService.searchCouponList(filterValue).subscribe(res => {
      if (res && res['data']) {
        this.dataSource.data = res['data'].couponlist;
        this.totalCoupons = res['data'].totalCoupons;
      }
    });
  }

  fetchCoupons(page: number, pageSize: number) {
    // Make API call to fetch coupons for the current page and page size
    this.couponService.fetchCoupons(page + 1, pageSize)  // Adjusting for 0-based index
      .subscribe(
        res => {
          this.couponlist = res['data'].couponlist;  // Assign current page data
          this.totalCoupons = res['data'].totalCoupons;  // Total number of coupons from API
          // Update the dataSource with the current page's data
          this.dataSource.data = this.couponlist;
        },
        error => {
          this.toastr.error(error.error.message);
        }
      );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    this.fetchCoupons(this.currentPage, this.pageSize);
  }

  edit(coupon: any) {
    this.router.navigate(['/coupons/edit-coupon/' + coupon._id]);
  }

  view(coupon: any) {
    localStorage.setItem('current_coupon', coupon._id);
    this.router.navigate(['/coupons/coupon-order-list/' + coupon._id]);
  }

  statusChange(coupon: any) {
    if (coupon.is_active === true) {
      coupon.is_active = false;
    }
    else {
      coupon.is_active = true;
    }
    let jsondata = {
      "coupon_id": coupon._id,
      "is_active": coupon.is_active
    }
    this.couponService.couponStatusChange(jsondata).subscribe(
      res => {
        this.toastr.success('Coupon Status Updated', 'Success');
      },
      error => {
        this.toastr.error(error.error.message)
      }
    );
  }

   couponWebsiteViewStatusChange(coupon: any) {
    if (coupon.website_view === true) {
      coupon.website_view = false;
    }
    else {
      coupon.website_view = true;
    }
    let jsondata = {
      "coupon_id": coupon._id,
      "website_view": coupon.website_view
    }
    this.couponService.couponWebsiteViewStatusChange(jsondata).subscribe(
      res => {
        this.toastr.success('Coupon Status Updated', 'Success');
      },
      error => {
        this.toastr.error(error.error.message)
      }
    );
  }



fetchCouponUsedUsers(data: any) {
  console.log("Fetching users for coupon ID:", data);
  // Make API call to fetch coupons for the current page and page size
  this.couponService.getCouponUsageUsers({couponId: data})  // Adjusting for 0-based index
    .subscribe(
      res => {
        console.log(res)
        this.couponUsedUserslist = res['data'].users;  // Assign current page data
      },
      error => {
        this.toastr.error(error.error.message);
      }
    );
}


openCouponUsedUsersModal(coupon: any) {
  this.showCouponUsedUsersModal = true;
  this.fetchCouponUsedUsers(coupon._id);
  console.log(coupon._id)

}

closeCouponUsedUsersModal() {
  this.showCouponUsedUsersModal = false;
}


}

