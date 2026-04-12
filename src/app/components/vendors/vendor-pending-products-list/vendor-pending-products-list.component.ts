import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../../products/product.service';
import { VendorsService } from '../vendor.service';
@Component({
  selector: 'vendor-pending-products-list',
  templateUrl: './vendor-pending-products-list.component.html',
  styleUrls: ['./vendor-pending-products-list.component.scss']
})
export class VendorPendingProductListComponent implements OnInit {

  @ViewChild('productDelete', { static: true })
  productDelete!: TemplateRef<any>;

  @ViewChild('productGLB', { static: true })
  productGLB!: TemplateRef<any>;

  public product_list = []
  productavailable: boolean = false;
  delete_product_id: any;
  delete_product_vendor: any;
  userrole: any;
  isAdmin: boolean = false;
  hideCopyButton: boolean = false;
  renderValueOpp: any = 'Pending';
  displayedColumns: string[] = ['product_image', 'product_name', 'product_category_name', 'product_retail_price', 'product_details_status', 'product_glb', 'status'];
  dataSource = new MatTableDataSource<any>();
  totalProduct = 0;
  pageSize = 10;
  currentPage = 0;
  vendorType: any;
  upload3DImage: any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private vendorService: VendorsService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private toastrService: ToastrService, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
            if(localStorage.getItem('product_page') != null)
    {
      this.currentPage = parseInt(localStorage.getItem('product_page'));
      localStorage.removeItem('product_page');
    }
    this.productlist(this.currentPage, this.pageSize, this.route.snapshot.paramMap.get('id'));

    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::", this.vendorType);
  }

  productlist(page: number, pageSize: number, vendor_id) {
    this.vendorService.allAdminPendingProductlist(page + 1, pageSize, this.route.snapshot.paramMap.get('id')).subscribe(
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
    this.productlist(this.currentPage, this.pageSize, this.route.snapshot.paramMap.get('id'));
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
      "vendor_id": this.route.snapshot.paramMap.get('id'),
      "vendor_type": this.vendorType,
    }
    this.vendorService.statusChangeGLBPendingProducts(jsondata).subscribe(
      res => {
        this.toastrService.success('Product Updated', 'Success');
        this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/vendors/pending-product-list/' + this.route.snapshot.paramMap.get('id')]);
        });
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }

  editProduct(product_slug) {
    this.router.navigate(['/products/edit-product/' + product_slug]);
        localStorage.setItem('product_page',this.currentPage.toString());
  }

  productGLBView(glbfile) {
    console.log('glbfile', glbfile);
    this.upload3DImage = glbfile;
    this.dialog.open(this.productGLB, { disableClose: false })
  }

}
