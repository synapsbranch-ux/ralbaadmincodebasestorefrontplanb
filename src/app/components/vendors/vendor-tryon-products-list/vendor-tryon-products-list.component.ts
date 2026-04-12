import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../products/product.service';
import { ProductStatusChangeComponent } from './../../products/product-status-change/product-status-change.component';
import { VendorsService } from './../vendor.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-tryon-product-list',
  templateUrl: './vendor-tryon-products-list.component.html',
  styleUrls: ['./vendor-tryon-products-list.component.scss']
})
export class VendorTryonProductListComponent implements OnInit {
  public product_list = []
  userrole: any;
  isAdmin: boolean = false;
  totalProduct = 0;
  pageSize = 10;
  currentPage = 0;
  productavailable: boolean = false;
  displayedColumns: string[] = ['product_image', 'product_name', 'product_category_name', 'product_retail_price', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public vendorservice: VendorsService, private router: Router, private route: ActivatedRoute, private productservice: ProductService, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.allproductlisstbyvendor(this.currentPage, this.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  allproductlisstbyvendor(page: number, pageSize: number) {
    this.vendorservice.getTryonProductListByVendor(this.route.snapshot.paramMap.get('id'),page + 1, pageSize).subscribe(
      res => {
        this.totalProduct = res['data'].totalCount;
        const filterProducts = res['data'].products;
        if (res['data'].products.length > 0) {
          this.productavailable = true;
        }
        this.dataSource.data = filterProducts.map(product => ({
          ...product,
          product_image: product.product_image.length > 0 ? product.product_image[0].pro_image : 'assets/images/cat3.png'
        }));
        // console.log('Product List', res);
        console.log('Product List', res);
      })
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
    // Handle paginator page changes
    onPageChange(event: PageEvent) {
      this.pageSize = event.pageSize;          // Update page size when it changes
      this.currentPage = event.pageIndex;      // Get the current page index (0-based)
      // Fetch data for the new page and page size
      this.allproductlisstbyvendor(this.currentPage, this.pageSize);
    }
  
    
  statusChange(product) {
    if (product.status == 'active') {
      product.status = "pending";
    }
    else {
      product.status = "active";
    }
    let jsondata =
    {
      "product_id": product._id,
      "status": product.status
    }
    this.productservice.statusChangeProductsByAdmin(jsondata).subscribe(
      res => {
        this.toastr.success('Product Updated', 'Success');
      },
      error => {
        this.toastr.error(error.error.message)
      }
    );


  }

  edit(product: any) {
    this.router.navigate(['/products/edit-product/' + product.product_slug]);
  }

  activeAllProduct() {
    let APData =
    {
      vendor_id: this.route.snapshot.paramMap.get('id'),
      status: "active"
    }

    this.productservice.bulkstatusChangeProductsByAdmin(APData).subscribe(
      res => {
        this.toastr.success('All Products are Active Now', 'Success');
        this.allproductlisstbyvendor(this.currentPage, this.pageSize);
        // console.log('Active All Product', res);
      },
      error => {
        this.toastr.error(error.error.message)
      }
    )

  }


}