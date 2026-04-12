import { ToastrService } from 'ngx-toastr';
import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../brand.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { BrandStatusChangeComponent } from '../brand-status-change/brand-status-change.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.scss']
})
export class ListBrandComponent implements OnInit {
  @ViewChild('brandDelete', { static: true })
  brandDelete!: TemplateRef<any>;
  smartTable: any;
  userrole: any;
  isAdmin: boolean = false;
  brandLists = [];
  brandavailable: boolean = false;
  delete_brand_id: any;
  delete_storeby_vendor: any;
  storeurl = environment.storeURL
  brand: any;
  brand_status_name: any;
  totalBrands = 0;
  pageSize = 10;
  currentPage = 0;
  displayedColumns: string[] = ['brand_image', 'brand_name', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  private startTime: number;
  private searchTimeout: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private brandservice: BrandService, private ngZone: NgZone, private route: ActivatedRoute, private dialog: MatDialog, private toastrService: ToastrService) {

  }
  // public settings = {
  //   // hideSubHeader: true,
  //   columns: {
  //     brand_image:{
  //       title: 'Brand Image',
  //       type:'html',
  //       valuePrepareFunction: (value) =>
  //       { 
  //         if(value)
  //           {
  //             return '<img width="100px" class="product_image" src= ' + value + '  />' 
  //           }
  //           else
  //           {
  //             return '<img width="100px" class="product_image" src="assets/images/1.jpg" />'
  //           }

  //       },
  //     },
  //     brand_name: {
  //       title: 'Brand Name'
  //     },
  //     button: {
  //       title: 'Status',
  //       type: 'custom',
  //       renderComponent: BrandStatusChangeComponent,
  //     },
  //   },     

  //   actions: {
  //     columnTitle: 'Actions',
  //     add: false,
  //     delete: true,
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
    this.allBrandList(this.currentPage, this.pageSize);
    // Subscribe to the searchSubject and debounce the keypresses
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
              this.allBrandList(this.currentPage, this.pageSize);
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
    this.brandservice.searchBrandlist(filterValue).subscribe(res => {
      if (res && res.data) {
        this.dataSource.data = res.data.brandList;
        this.totalBrands = res.data.totalBrands;
      }
    });
  }

  // ngAfterViewInit(): void {

  //   this.smartTable.edit.subscribe( (dataObject: any) => {
  //     this.router.navigate(['/brand/edit-brand/'+dataObject["data"]._id]);
  //   });

  //   this.smartTable.delete.subscribe( (dataObject: any) => {
  //     this.delete_brand_id=dataObject["data"]._id;
  //     this.dialog.open(this.brandDelete,{ disableClose: false });
  //   });

  // }

  allBrandList(page: number, pageSize: number) {

    /////  Admin All Brand   /////////

    if (this.userrole == 'admin') {
      this.brandservice.allbrandlist(page + 1, pageSize).subscribe(
        res => {
          this.brandLists = res['data'].brandList;
          this.dataSource.data = res['data'].brandList;
          this.totalBrands = res['data'].totalBrands;  // Total number of users from API
          console.log('List Of Brand API ==== ', res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )

    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    this.allBrandList(this.currentPage, this.pageSize);
  }

  deleteConfirm() {

    ////////////////// Vendor Delete Brand    /////////////////
    if (this.userrole == 'admin') {
      this.brand =
      {
        "brand_id": this.delete_brand_id,
        "status": 'deleted'
      }

      this.brandservice.singleBrandUpdate(this.brand).subscribe(
        res => {
          this.allBrandList(this.currentPage, this.pageSize);
          this.toastrService.success('Your Brand Deleted Successfully');
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }


  }

  statusChange(brand) {
    let vendor_id = localStorage.getItem('current-vendor')
    if (brand.status == 'active') {
      brand.status = "pending";
    }
    else {
      brand.status = "active";
    }
    let jsondata =
    {
      "brand_id": brand._id,
      "status": brand.status

    }
    this.brandservice.singleBrandUpdate(jsondata).subscribe(
      res => {
        this.toastrService.success('Brand Updated', 'Success');
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }

  edit(brand) {
    this.router.navigate(['/brand/edit-brand/' + brand._id]);
  }
  delete(brand) {
    this.delete_brand_id = brand._id;
    this.dialog.open(this.brandDelete, { disableClose: false });
  }

}
