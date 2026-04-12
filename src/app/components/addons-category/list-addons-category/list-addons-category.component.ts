import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { AddonsCategoryService } from '../addons-category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddonsCategory } from '../addon-category.model';

@Component({
  selector: 'app-list-addons-category',
  templateUrl: './list-addons-category.component.html',
  styleUrls: ['./list-addons-category.component.scss']
})
export class ListAddonsCategoryComponent implements OnInit {
  userrole: any;
  isAdmin: boolean = false;
  storeavailable: boolean = false;
  delete_store_id: any;
  delete_storeby_vendor: any;
  storeurl = environment.storeURL
  store: any;
  store_status_name: any;
  vendorType:any;

  displayedColumns: string[]
  // displayedColumns: string[] = ['category_image', 'category_name', 'status'];
  dataSource = new MatTableDataSource<AddonsCategory>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentUrl: string;
  constructor(private router: Router, private addons_service: AddonsCategoryService, private route: ActivatedRoute, private dialog: MatDialog, private toastrService: ToastrService) { }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.allCategoryList();
    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::",this.vendorType);
    if(this.vendorType === 'access'){
      this.displayedColumns = ['category_image', 'category_name', 'status'];
    }
    else{
      this.displayedColumns = ['category_image', 'category_name', 'status','actions'];
    }
    // Navigation Routes...!!!
    this.currentUrl = this.router.url;
    localStorage.setItem('lastUrl', this.currentUrl);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  allCategoryList() {
    this.addons_service.allCategoriesList().subscribe(
      res => {
        this.dataSource.data = res['data'];
        this.dataSource.paginator = this.paginator;  // Assign paginator here
        this.dataSource.sort = this.sort;  // Assign sort here
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  edit(addonsCategory: AddonsCategory) {
    this.router.navigate(['/vendor-addons/edit-addons-category/' + addonsCategory._id]);
  }
}
