import { ProductStatusChangeComponent } from '../product-status-change/product-status-change.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'approve-products-list',
  templateUrl: './approve-products-list.component.html',
  styleUrls: ['./approve-products-list.component.scss']
})
export class ApproveProductListComponent implements OnInit {

  @ViewChild('productDelete', { static: true })
  productDelete!: TemplateRef<any>;

  @ViewChild('productCopy', { static: true })
  productCopy!: TemplateRef<any>;

  public product_list = []
  productavailable: boolean = false;
  delete_product_id: any;
  delete_product_vendor: any;
  userrole: any;
  isAdmin: boolean = false;
  hideCopyButton: boolean = false;
  renderValueOpp: any = 'Pending';
  displayedColumns: string[] = ['product_image', 'product_name', 'product_category_name', 'product_retail_price', 'product_details_status', 'status'];
  dataSource = new MatTableDataSource<any>();
  totalProduct = 0;
  pageSize = 10;
  currentPage = 0;
  vendorType: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productservice: ProductService, private router: Router, private dialog: MatDialog, private toastrService: ToastrService, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.productlist(this.currentPage, this.pageSize);

    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::", this.vendorType);
  }

  productlist(page: number, pageSize: number) {
    this.productservice.allApprovedProductlist(page + 1, pageSize).subscribe(
      res => {
        this.product_list = res['data'].products;
        this.totalProduct = res['data'].totalRecords;
        this.checkCopiedProducts(this.product_list);
        this.dataSource.data = this.product_list.map(product => ({
          ...product,
          product_image: product.product_details.product_image.length > 0 ? product.product_details.product_image[0].pro_image : 'assets/images/cat3.png'
        }));

        console.log('Product List', this.product_list);
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    )
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
    this.dataSource.sort = this.sort;
  }

  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    this.productlist(this.currentPage, this.pageSize);
  }


  checkCopiedProducts(products: any[]) {
    for (let product of products) {
      if (product.copied_by_vendors && product.copied_by_vendors.length > 0) {
        this.hideCopyButton = true;
        break; // Stop the loop as soon as a copied product is found
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  statusChange(renderValue: any, product) {
    if (product.vendor_approve === true && product.admin_approve === true) {
      product.status = "active";
    }
    else {
      product.status = "pending";
    }
    let jsondata =
    {
      "product_id": renderValue,
    }
    this.productservice.statusChangeGLBPendingProducts(jsondata).subscribe(
      res => {
        this.toastrService.success('Product Updated', 'Success');
        this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/products/approve-product-list']);
        });
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );


  }

  edit(product: any) {
    this.router.navigate(['/products/edit-product/' + product.product_slug]);
  }
  delete(product: any) {
    this.delete_product_id = product._id;
    this.delete_product_vendor = product.product_owner['_id'];
    this.dialog.open(this.productDelete, { disableClose: false })
  }
  deleteConfirm() {
    if (this.userrole == 'vendor') {
      let pData =
      {
        "product_id": this.delete_product_id
      }

      this.productservice.vendorDeleteProducts(pData).subscribe(
        res => {
          this.productlist(this.currentPage, this.pageSize);
          console.log('Product Deleted', res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }
    if (this.userrole == 'admin') {
      let pData =
      {
        "product_id": this.delete_product_id,
        "vendor_id": this.delete_product_vendor
      }
      this.productservice.adminDeleteProducts(pData).subscribe(
        res => {
          this.productlist(this.currentPage, this.pageSize);
          console.log('Product Deleted', res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )

    }
  }


}
