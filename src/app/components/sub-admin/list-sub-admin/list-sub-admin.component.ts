import { SubAdminStatusChangeComponent } from './../sub-admin-status-change/sub-admin-status-change.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, TemplateRef, NgZone } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubAdminService } from '../sub-admin.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-sub-admin',
  templateUrl: './list-sub-admin.component.html',
  styleUrls: ['./list-sub-admin.component.scss']
})
export class ListSubAdminComponent implements OnInit {

  subadminList = [];
  subadminListAvailable: boolean = false;

  userrole: any;
  isAdmin: boolean = false;
  department_status_name: any
  delete_department_id: any;
  totalSubadmin = 0;
  pageSize = 10;
  currentPage = 0;

  displayedColumns: string[] = ['name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private startTime: number;
  private searchTimeout: any;


  constructor(private router: Router, private ngZone: NgZone, private subadminService: SubAdminService, private route: ActivatedRoute, private dialog: MatDialog, private toastrService: ToastrService) {

  }

  @ViewChild('departmentDelete', { static: true })
  departmentDelete!: TemplateRef<any>;

  // @ViewChild('table')
  // smartTable: any;

  // public settings = {
  //   // hideSubHeader: true,
  //   columns: {

  //     name: {
  //       title: 'Sub Admin Name'
  //     },
  //     email: {
  //       title: 'Sub Admin Email'
  //     },
  //     button: {
  //       title: 'Status & Module Access',
  //       type: 'custom',
  //       renderComponent: SubAdminStatusChangeComponent,
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
    }
    this.allSubadminList(this.currentPage, this.pageSize);

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
              this.allSubadminList(this.currentPage, this.pageSize);
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
    this.subadminService.searchSubAdmin(filterValue).subscribe(res => {
      if (res && res['data']) {
        this.totalSubadmin = res['data'].subadminList;
        this.dataSource.data = res['data'].subadminList;
      }
    });
  }


  // ngAfterViewInit(): void {

  //   this.smartTable.edit.subscribe( (dataObject: any) => {
  //     this.router.navigate(['/subadmin/edit-sub-admin/'+dataObject["data"]._id]);
  //   });

  //   this.smartTable.delete.subscribe( (dataObject: any) => {
  //     this.delete_department_id=dataObject["data"]._id;
  //     this.dialog.open(this.departmentDelete,{ disableClose: false });
  //   });

  // }

  edit(subadmin) {
    this.router.navigate(['/subadmin/edit-sub-admin/' + subadmin._id]);
  }
  delete(subadmin) {
    this.delete_department_id = subadmin._id;
    this.dialog.open(this.departmentDelete, { disableClose: false });
  }
  allSubadminList(page: number, pageSize: number) {

    if (this.userrole == 'admin') {

      this.subadminService.allSubAdmin(page + 1, pageSize).subscribe(
        res => {
          this.subadminList = res['data'].subadminList;
          this.totalSubadmin = res['data'].totalRecords;
          this.dataSource.data = res['data'].subadminList;

          // console.log('List Of subadminList API ==== ',res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )

    }
  }

  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    this.allSubadminList(this.currentPage, this.pageSize);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  statusChange(subadmin) {
    if (subadmin.status == 'active') {
      subadmin.status = "pending";
    }
    else {
      subadmin.status = "active";
    }
    let jsondata =
    {
      "subadmin_id": subadmin._id,
      "status": subadmin.status

    }
    this.subadminService.singleSubadminUpdateAdmin(jsondata).subscribe(
      res => {
        this.toastrService.success('Subadmin Updated', 'Success');
        // console.log('AS Status',res);  
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }

  moduleAccessChange(subadmin) {
    this.router.navigate(['/subadmin/module-access/' + subadmin._id]);
  }


}
