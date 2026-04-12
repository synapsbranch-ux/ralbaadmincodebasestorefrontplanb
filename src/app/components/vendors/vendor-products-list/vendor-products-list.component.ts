import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../products/product.service';
import { ProductStatusChangeComponent } from './../../products/product-status-change/product-status-change.component';
import { VendorsService } from './../vendor.service';
import { Component, NgZone, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-product-list',
  templateUrl: './vendor-products-list.component.html',
  styleUrls: ['./vendor-products-list.component.scss']
})
export class VendorProductListComponent implements OnInit {
  public product_list = []
  productavailable: boolean = false;
  userrole: any;
  isAdmin: boolean = false;
  totalProduct = 0;
  pageSize = 10;
  currentPage = 0;
  private startTime: number;
  private searchTimeout: any;
  currentSearch: string = '';
  private restoreSearch: string = '';
  private restoreScrollY: number = 0;
  private didApplyScroll: boolean = false;
  private searchResultsAll: any[] = [];
  private isSearching: boolean = false;
  private lastSearchAt: number = 0;
  private lastListAt: number = 0;

  renderValueOpp: any = 'Pending';
  displayedColumns: string[] = ['product_image', 'product_name', 'product_category_name', 'product_retail_price', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(public vendorservice: VendorsService, private ngZone: NgZone, private router: Router, private route: ActivatedRoute, private productservice: ProductService, private toastr: ToastrService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
            if(localStorage.getItem('product_page') != null)
    {
      this.currentPage = parseInt(localStorage.getItem('product_page'));
    }
    if(localStorage.getItem('product_pageSize') != null){
      const ps = parseInt(localStorage.getItem('product_pageSize') || '10', 10);
      this.pageSize = isNaN(ps) ? this.pageSize : ps;
    }
    if(localStorage.getItem('product_search') != null){
      this.restoreSearch = localStorage.getItem('product_search') || '';
    }
    if(localStorage.getItem('product_scrollY') != null){
      const raw = localStorage.getItem('product_scrollY') || '0';
      const match = raw.match(/-?\d+/);
      const y = match ? parseInt(match[0], 10) : 0;
      this.restoreScrollY = isNaN(y) ? 0 : y;
    }
    this.didApplyScroll = false;
    this.allproductlisstbyvendor(this.currentPage, this.pageSize);
  }



  // Trigger when user types in the search box
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.currentSearch = filterValue;

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
        if (elapsedTime >= 600) {  // 0.6s delay for faster search response
          this.ngZone.run(() => {
            if (filterValue.length > 0) {
              this.triggerSearch(filterValue, true);
            } else {
              // Reset paginator to first page and load normal list
              this.currentPage = 0;
              if (this.paginator) {
                this.paginator.firstPage();
              }
              this.allproductlisstbyvendor(this.currentPage, this.pageSize);
            }
          });
        } else {
          this.searchTimeout = requestAnimationFrame(checkTime);
        }
      };
      this.searchTimeout = requestAnimationFrame(checkTime);
    });
  }

  // Additional API request function for search (with client-side pagination)
  triggerSearch(filterValue: string, resetPage: boolean = false): void {
    this.isSearching = true;
    const startedAt = performance.now();
    this.lastSearchAt = startedAt;
    this.vendorservice.searchProductlist(filterValue, this.route.snapshot.paramMap.get('id')).subscribe(res => {
      if (res && res['data']) {
        // Ignore if a newer full-list request completed after this search started (rare)
        if (this.lastListAt && this.lastListAt > startedAt) {
          return;
        }
        const product_list = res['data'].products || [];
        this.searchResultsAll = product_list.map(product => ({
          ...product,
          product_image: product.product_image && product.product_image.length > 0 ? product.product_image[0].pro_image : 'assets/images/cat3.png'
        }));
        // Show all results on a single page during search
        this.totalProduct = this.searchResultsAll.length;
        this.currentPage = 0;
        this.pageSize = this.totalProduct;
        this.dataSource.data = this.searchResultsAll;
        this.applyRestoreScrollOnce();
        // Sync paginator UI with search state
        if (this.paginator) {
          this.paginator.length = this.totalProduct;
          this.paginator.pageIndex = 0;
          this.paginator.pageSize = this.totalProduct;
        }
        this.cdr.detectChanges();
        this.isSearching = true;
      }
    });
  }

  private updatePagedData(): void {
    if (this.currentSearch && this.currentSearch.length > 0) {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      this.dataSource.data = this.searchResultsAll.slice(start, end);
      this.cdr.detectChanges();
    }
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

  tryonproducts() {
    this.router.navigate(['/vendors/vendor-tryon-product-list/' + this.route.snapshot.paramMap.get('id')]);
  }

  allproductlisstbyvendor(page: number, pageSize: number) {
    const startedAt = performance.now();
    this.lastListAt = startedAt;
    this.vendorservice.getProductListByVendor(this.route.snapshot.paramMap.get('id'), page + 1, pageSize).subscribe(
      res => {
        // If a search started after this list call, do not apply this response
        if (this.lastSearchAt && this.lastSearchAt > startedAt) {
          return;
        }
        this.totalProduct = res['data'].totalCount;
        const filterProducts = res['data'].products.filter(product => {
          const has3DImage = product.product_3d_image.length > 0;
          const hasAnyImage = product.product_image.length > 0 ||
            product.product_tryon_2d_image.length > 0 ||
            product.product_tryon_3d_image.length > 0 ||
            product.product_store_3d_image.length > 0;

          return has3DImage && hasAnyImage;
        });
        if (res['data'].products.length > 0) {
          this.productavailable = true;
        }
        this.dataSource.data = filterProducts.map(product => ({
          ...product,
          product_image: product.product_image.length > 0 ? product.product_image[0].pro_image : 'assets/images/cat3.png'
        }));
        // console.log('Product List', res);
        this.applyRestoreScrollOnce();
        this.isSearching = false;
        this.cdr.detectChanges();
      })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    if (this.searchInput && this.restoreSearch) {
      setTimeout(() => {
        this.searchInput.nativeElement.value = this.restoreSearch;
        this.currentSearch = this.restoreSearch;
        // Always trigger search on restore so results match the shown term
        this.triggerSearch(this.restoreSearch, true);
        this.searchInput.nativeElement.focus();
        // Scroll will be applied after data loads in applyRestoreScrollOnce
        // Clear persisted search and page now that they've been applied
        if (localStorage.getItem('product_search')) {
          localStorage.removeItem('product_search');
        }
        if (localStorage.getItem('product_page')) {
          localStorage.removeItem('product_page');
        }
      });
    } else if (this.searchInput) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      });
    }
  }

  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    // When searching: ignore paginator changes (single page showing all)
    if (this.currentSearch && this.currentSearch.length > 0) {
      if (this.paginator) {
        this.paginator.length = this.totalProduct;
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = this.totalProduct;
      }
      this.currentPage = 0;
      this.pageSize = this.totalProduct;
      this.dataSource.data = this.searchResultsAll;
      this.cdr.detectChanges();
      return;
    } else {
      const sizeChanged = event.pageSize !== this.pageSize;
      const nextIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.currentPage = nextIndex;
      // Fetch data for the new page and page size
      this.allproductlisstbyvendor(this.currentPage, this.pageSize);
    }
    // Keep user's choice of page size for back navigation
    localStorage.setItem('product_pageSize', this.pageSize.toString());
    // Keep input focused for quick typing
    if (this.searchInput) {
      setTimeout(() => this.searchInput.nativeElement.focus());
    }
  }

  clearSearch(): void {
    this.currentSearch = '';
    this.pageSize=10
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.focus();
    }
    localStorage.removeItem('product_search');
    // keep last scrollY record for back behavior if user navigates away; do not clear here
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.length = this.totalProduct;
      this.paginator.pageIndex = this.currentPage;
      this.paginator.pageSize = this.pageSize;
    }
    this.isSearching = false;
    this.searchResultsAll = [];
    // Restore normal pagination size (from localStorage if present)
    const savedSize = parseInt(localStorage.getItem('product_pageSize') || `${this.pageSize}`, 10);
    this.pageSize = isNaN(savedSize) ? this.pageSize : savedSize;
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
    }
    this.allproductlisstbyvendor(this.currentPage, this.pageSize);
    this.cdr.detectChanges();
  }


  // ngAfterViewInit(): void {

  //   this.smartTable.edit.subscribe( (dataObject: any) => {
  //     this.router.navigate(['/products/edit-product/'+dataObject["data"].product_slug]);
  //   });

  // }

  //   edit_product(product_id)
  // {
  //   this.router.navigate(['/products/edit-product/'+product_id]);
  //   // console.log('Product Edit', product_id);
  // }

  edit(product: any) {
    // Persist current list state before navigating to edit
    localStorage.setItem('product_page', this.currentPage.toString());
    localStorage.setItem('product_pageSize', this.pageSize.toString());
    localStorage.setItem('product_search', this.currentSearch || '');
    localStorage.setItem('product_scrollY', `scrollY: ${window.scrollY || 0}`);
    this.router.navigate(['/products/edit-product/' + product.product_slug]);
  }

  private applyRestoreScrollOnce(): void {
    if (!this.didApplyScroll && this.restoreScrollY > 0) {
      const apply = () => {
        // Retry a few times until the scroll sticks (rows rendered)
        let attempts = 0;
        const target = this.restoreScrollY;
        const tryScroll = () => {
          attempts++;
          // Try window first
          window.scrollTo({ top: target, behavior: 'auto' });
          // Also set document scrolling element in case the app uses it
          if (document.scrollingElement) {
            (document.scrollingElement as HTMLElement).scrollTop = target;
          }
          // Fallback: try common container
          const container = document.querySelector('.table-responsive') as HTMLElement ||
                            document.querySelector('.mat-table') as HTMLElement ||
                            document.querySelector('.content') as HTMLElement;
          if (container) {
            container.scrollTop = target;
          }
          // Check if applied
          const applied = Math.abs((window.scrollY || 0) - target) < 5 ||
                          (document.scrollingElement && Math.abs((document.scrollingElement as HTMLElement).scrollTop - target) < 5) ||
                          (container && Math.abs(container.scrollTop - target) < 5);
          if (!applied && attempts < 10) {
            requestAnimationFrame(tryScroll);
          } else {
            this.restoreScrollY = 0;
            this.didApplyScroll = true;
            if (localStorage.getItem('product_scrollY')) {
              localStorage.removeItem('product_scrollY');
            }
          }
        };
        requestAnimationFrame(tryScroll);
      };
      // Wait for Angular to be stable (DOM rendered) before scrolling
      const sub = this.ngZone.onStable.subscribe(() => {
        sub.unsubscribe();
        // One more microtask to let mat-table render rows
        setTimeout(apply, 0);
      });
    }
  }

  delete_product(product_id) {
    var result = confirm("Want to delete?");
    if (result) {
      // console.log('Product Deleted', product_id);
    }

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