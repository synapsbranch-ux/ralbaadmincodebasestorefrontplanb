import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatagoriesService } from '../catagories.service';
import { ViewSubCatagoriesBtnComponent } from '../view-sub-catagories/view-sub-catagories.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewAttributeBtnComponent } from '../view-attribute/view-attribute.component';
import { ViewaddonsBtnComponent } from '../view-addons/view-addons.component';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { AddonsCategory } from '../../addons-category/addon-category.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-list-catagories',
  templateUrl: './list-catagories.component.html',
  styleUrls: ['./list-catagories.component.scss']
})
export class ListCatagoriesComponent implements OnInit {

  userrole: any;
  isAdmin: boolean = false;
  catagoriesList = [];
  delete_catagories_id: any
  catagories: any;
  store_status_name: any;
  totalCategory = 0;
  pageSize = 10;
  currentPage = 1;

  private startTime: number;
  private searchTimeout: any;

  @ViewChild('catagoriesDelete', { static: true })
  catagoriesDelete!: TemplateRef<any>;

  // @ViewChild('table')
  // smartTable: any
  // ;

  // public settings = {
  //   // hideSubHeader: true,
  //   columns: {
  //     category_image: {
  //       title: 'Category Image',
  //       type:'html',
  //       valuePrepareFunction: (value) =>
  //       { return '<img width="100px" height="100px"  src= ' + value + '  />' },
  //       filter: false
  //     },
  //     category_name: {
  //       title: 'Category Name',
  //     },
  //     status: {
  //       title: 'Category Status',
  //     },
  //     button: {
  //       title: 'View Sub Category',
  //       type: 'custom',
  //       renderComponent: ViewSubCatagoriesBtnComponent,
  //       filter: false
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


  displayedColumns: string[] = ['category_image', 'category_name', 'status', 'subCategory', 'actions'];
  dataSource = new MatTableDataSource<AddonsCategory>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private ngZone: NgZone, private catagoriesservice: CatagoriesService, private route: ActivatedRoute, private dialog: MatDialog, private toastrService: ToastrService) {

  }


  ngOnInit() {

    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.allCatagoriesList(this.currentPage, this.pageSize);
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
              this.allCatagoriesList(this.currentPage, this.pageSize);
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
    this.catagoriesservice.searchCategorylist(filterValue).subscribe(res => {
      if (res && res.data) {
        this.dataSource.data = res.data.categoryList;
        this.totalCategory = res.data.totalCategory;
      }
    });
  }


  allCatagoriesList(currentPage: any, pageSize: any) {

    /////  Admin All Category   /////////

    if (this.userrole == 'admin') {
      this.catagoriesservice.allCatagorieslistFilter(currentPage, pageSize).subscribe(
        res => {
          this.catagoriesList = res['data'].categoryList;
          this.dataSource.data = res['data'].categoryList;
          this.totalCategory = res['data'].totalCategory;
          this.dataSource.paginator = this.paginator;  // Assign paginator here
          this.dataSource.sort = this.sort;  // Assign sort here
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )

    }



  }

  // ngAfterViewInit(): void {

  //   this.smartTable.edit.subscribe( (dataObject: any) => {

  //     this.router.navigate(['/categories/edit-categories/'+dataObject["data"]._id]);
  //   });

  //   this.smartTable.delete.subscribe( (dataObject: any) => {
  //     this.delete_catagories_id=dataObject["data"]._id;
  //     this.dialog.open(this.catagoriesDelete,{ disableClose: false });
  //   });

  // }


  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    this.allCatagoriesList(this.currentPage, this.pageSize);
  }


  edit(addonsCategory: AddonsCategory) {
    this.router.navigate(['/categories/edit-categories/' + addonsCategory._id]);
  }

  deleteConfirm() {

    let catagories =
    {
      "category_id": this.delete_catagories_id
    }

    // if(this.userrole == 'vendor')
    // {
    // this.departmentservice.singleDepartmentDelete(catagories).subscribe(
    //   res =>
    //   {
    //     this.departmentservice.allDepartment().subscribe(
    //       res =>{
    //         this.departmentList=res['data'];
    //         if(this.departmentList.length > 0)
    //         {
    //           this.departmentavailable=true;
    //         }
    //         else
    //         {
    //           this.departmentavailable=false;
    //         }
    //         // console.log('List Of Department API ==== ',res);
    //       }
    //     )
    //     this.allDepartmentList();
    //     // console.log('Store Deleted', res);
    //   }
    // )
    // }
    if (this.userrole == 'admin') {
      this.catagoriesservice.singleCatagoriesDelete(catagories).subscribe(
        res => {
          this.catagoriesservice.allCatagorieslist().subscribe(
            res => {
              this.catagoriesList = res['data'];
            },
            error => {
              this.toastrService.error(error.error.message)
            }
          )
        }
      )

    }

  }

  viewSubCategory(addonsCategory: AddonsCategory) {
    localStorage.setItem('cat_id', addonsCategory._id);
    this.router.navigate(['/categories/list-sub-categories/' + addonsCategory._id]);
  }
}
