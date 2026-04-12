import { UserViewOrderBtnComponent } from './../user-view-order-btn/user-view-order-btn.component';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../user.service';
import { UserStatusChangeComponent } from '../user-status-change/user-status-change.component';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  providers: [DatePipe]
})
export class ListUserComponent implements OnInit {
  useravailable: boolean = false;
  userrole: any;
  isAdmin: boolean = false;
  user_status_name: any
  userslist: any[] = [];
  totalUsers = 0;
  pageSize = 10;
  currentPage = 0;
  displayedColumns: string[] = ['name', 'phone', 'email', 'createdAt', 'status', 'viewOrder', 'actions'];
  dataSource = new MatTableDataSource<any>();
  private startTime: number;
  private searchTimeout: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userservice: UsersService, private datePipe: DatePipe, private ngZone: NgZone, private router: Router, private toastr: ToastrService) {

  }

  // @ViewChild('table')
  // smartTable: any;

  // public settings = {
  //   // hideSubHeader: true,
  //   columns: {
  //     name:{
  //       title: 'User Name',
  //     },
  //     phone: {
  //       title: 'User Phone'
  //     },
  //     email: {
  //       title: 'User Email'
  //     },
  //     createdAt: {
  //       title: 'Register Date',
  //       valuePrepareFunction: (createdAt) => {
  //         return this.datePipe.transform(new Date(createdAt), 'dd MMM yyyy');
  //       }
  //     },
  //     button: {
  //       title: 'View Order',
  //       type: 'custom',
  //       renderComponent: UserViewOrderBtnComponent,
  //       filter: false
  //     },
  //     button2: {
  //       title: 'Status',
  //       type: 'custom',
  //       renderComponent: UserStatusChangeComponent,
  //       filter: false
  //     },
  //   },
  //   actions: {
  //     columnTitle: 'Actions',
  //     add: false,
  //     delete: false,
  //     position: 'right'
  //   },

  //   edit: {
  //     editButtonContent: '<i class="nb-edit"></i>',
  //     saveButtonContent: '<i class="nb-checkmark"></i>',
  //     cancelButtonContent: '<i class="nb-close"></i>',
  //   },
  //   mode: 'external',
  // };


  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
      this.fetchUsers(this.currentPage, this.pageSize);
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
              this.fetchUsers(this.currentPage, this.pageSize);
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
    this.userservice.searchUserListAdmin(filterValue).subscribe(res => {
      if (res && res['data']) {
        this.dataSource.data = res['data'].userlist;
        this.totalUsers = res['data'].totalUsers;
      }
    });
  }

  fetchUsers(page: number, pageSize: number) {
    // Make API call to fetch users for the current page and page size
    this.userservice.allUserListAdmin(page + 1, pageSize)  // Adjusting for 0-based index
      .subscribe(
        res => {
          this.userslist = res['data'].userlist;  // Assign current page data
          this.totalUsers = res['data'].totalUsers;  // Total number of users from API
          // Update the dataSource with the current page's data
          this.dataSource.data = this.userslist;
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
    this.fetchUsers(this.currentPage, this.pageSize);
  }

  edit(user: any) {
    this.router.navigate(['/users/edit-user/' + user._id]);
  }

  view(user: any) {
    localStorage.setItem('current_user', user._id);
    this.router.navigate(['/users/user-order-list/' + user._id]);
  }

  statusChange(user: any) {
    if (user.status == 'active') {
      user.status = "inactive";
    }
    else {
      user.status = "active";
    }
    let jsondata =
    {
      "user_id": user._id,
      "status": user.status

    }
    this.userservice.userStatuschange(jsondata).subscribe(
      res => {
        this.toastr.success('User Status Updated', 'Success');
      },
      error => {
        this.toastr.error(error.error.message)
      }
    );
  }

}

