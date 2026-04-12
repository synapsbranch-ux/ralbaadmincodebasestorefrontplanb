import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-order-list',
  templateUrl: './user-order-list.component.html',
  styleUrls: ['./user-order-list.component.scss']
})
export class UserOrderListComponent implements OnInit {
  public userslist = [];
  userorderavailable: boolean = false;
  userrole: any;
  isAdmin: boolean = false;
  user_status_name: any
  orderData = [];
  totalOrder = 0;
  pageSize = 10;
  currentPage = 0;
  displayedColumns: string[] = ['_id', 'product_image', 'payment_status', 'payment_method', 'order_status', 'createdAt', 'total_order_amount', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userservice: UsersService, private router: Router, private route: ActivatedRoute, private toastrService: ToastrService) {

  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.userOrderList(this.currentPage, this.pageSize);
  }

  userOrderList(page: number, pageSize: number) {
    let uoData = {
      user_id: this.route.snapshot.paramMap.get('id'),
      page: page + 1,
      limit: pageSize
    }
    this.userservice.allOrderList(uoData).subscribe(
      res => {
        this.orderData = res['data'].orders;
        this.totalOrder = res['data'].totalOrders;
        this.dataSource.data = this.orderData.map(product => ({
          ...product,
          product_image: product.order_details.length > 0 ? product.order_details[0].product_image : 'assets/images/cat3.png'
        }));

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
    this.userOrderList(this.currentPage, this.pageSize);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  view(orderDeatils) {
    this.router.navigate(['order/view-order/' + orderDeatils._id]);
  }

  statuschange(orderDeatils) {
    this.router.navigate(['order/order-status-change/' + orderDeatils._id]);
  }


}

