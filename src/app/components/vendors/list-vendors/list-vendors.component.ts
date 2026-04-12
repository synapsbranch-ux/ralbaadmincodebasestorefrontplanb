import { VendorActionBtnComponent } from './../vendor-action-btn/vendor-action-btn.component';
import { Router } from '@angular/router';
import { VendorsService } from './../vendor.service';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit {
  public vendorslist = [];
  vendoravailable: boolean = false;
  userrole: any;
  isAdmin: boolean = false;
  vendor_status_name: any
  totalVendor = 0;
  pageSize = 10;
  currentPage = 0;
  selectedVendor: any;
  displayedColumns: string[] = ['name', 'phone', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private startTime: number;
  private searchTimeout: any;

  constructor(private router: Router, private ngZone: NgZone, private vendorlistService: VendorsService, private toastrService: ToastrService, public dialog: MatDialog) {

  }

  // public settings = {
  //   // hideSubHeader: true,
  //   columns: {
  //     name:{
  //       title: 'Vendor Name',
  //     },
  //     phone: {
  //       title: 'Vendor Phone',
  //       width: '10%'
  //     },
  //     email: {
  //       title: 'Vendor Email'
  //     },
  //     button: {
  //       title: 'Actions',
  //       type: 'custom',
  //       renderComponent: VendorActionBtnComponent,
  //       filter: false
  //     },
  //   },
  //   actions: {
  //     columnTitle: 'Actions',
  //     add: false,
  //     delete: false,
  //     edit:false,
  //     position: 'right',
  //     filter:false,
  //   },
  //   mode: 'external',
  // };

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
      if (localStorage.getItem('vendor_page') != null) {
        this.currentPage = parseInt(localStorage.getItem('vendor_page'));
        localStorage.removeItem('vendor_page');
      }
      this.allvendorlist(this.currentPage, this.pageSize);
    }

  }


  allvendorlist(page: number, pageSize: number) {
    this.vendorlistService.allVendorList(page + 1, pageSize).subscribe(
      res => {
        // console.log(res);
        this.vendorslist = res['data'].vendorList;
        this.totalVendor = res['data'].totalVendors;
        this.dataSource.data = res['data'].vendorList;
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
    this.allvendorlist(this.currentPage, this.pageSize);
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
              this.allvendorlist(this.currentPage, this.pageSize);
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
    this.vendorlistService.searchVendorlist(filterValue).subscribe(res => {
      if (res && res['data']) {
        this.totalVendor = res['data'].totalVendors;
        this.dataSource.data = res['data'].vendorList;
      }
    });
  }

  statusChange(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    if (vendor.status == 'active') {
      vendor.status = "pending";
    }
    else {
      vendor.status = "active";
    }
    let jsondata =
    {
      "vendor_id": vendor._id,
      "status": vendor.status

    }
    this.vendorlistService.vendorStatuschange(jsondata).subscribe(
      res => {
        this.toastrService.success('Vendor Status Updated', 'Success');
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }
  viewPendingProducts(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString());
    this.router.navigate(['/vendors/pending-product-list/' + vendor._id]);
  }

  viewApprovedProducts(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString())
    this.router.navigate(['/vendors/approved-product-list/' + vendor._id]);
  }
  viewStore(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString())
    this.router.navigate(['/vendors/list-vendor-store/' + vendor._id]);
  }

  viewDepartments(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString())
    this.router.navigate(['/vendors/vendor-department-list/' + vendor._id]);
  }

  viewRooms(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString())
    this.router.navigate(['/vendors/vendor-list-room/' + vendor._id]);
  }

  viewProducts(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString())
    this.router.navigate(['/vendors/vendor-product-list/' + vendor._id]);
  }

  viewOrder(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString())
    this.router.navigate(['/vendors/vendor-order-list/' + vendor._id]);
  }

  edit_vendor(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString())
    this.router.navigate(['/vendors/edit-vendor/' + vendor._id]);

  }

  bannerList(vendor) {
    localStorage.setItem('vendor_type', vendor.vendor_type);
    localStorage.setItem('vendor_page', this.currentPage.toString())
    this.router.navigate(['/vendors/vendor-banner-list/' + vendor._id]);
  }

}
