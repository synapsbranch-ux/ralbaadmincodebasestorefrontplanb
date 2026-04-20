import { ProductStatusChangeComponent } from './../product-status-change/product-status-change.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, NgZone, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

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
  displayedColumns: string[] = ['product_image', 'product_name', 'product_category_name', 'product_retail_price', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  totalProduct = 0;
  pageSize = 10;
  currentPage = 0;
  vendorType: any;
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
  showPlatformProducts = false;
  platformProducts: any[] = [];
  vendorMTGs: any[] = [];
  isPlatformLoading = false;
  isVendorMtgLoading = false;
  savingPlatformProductId: string | null = null;
  adminPendingDfEntries: any[] = [];
  loadingAdminPendingDf = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private productservice: ProductService, private ngZone: NgZone, private router: Router, private dialog: MatDialog, private toastrService: ToastrService, private changeDetectorRef: ChangeDetectorRef) {

  }

  clearSearch(): void {
    this.currentSearch = '';
    this.pageSize=10
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.focus();
    }
    localStorage.removeItem('admin_prod_search');
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.isSearching = false;
    this.searchResultsAll = [];
    const savedSize = parseInt(localStorage.getItem('admin_prod_pageSize') || `${this.pageSize}`, 10);
    this.pageSize = isNaN(savedSize) ? this.pageSize : savedSize;
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
    }
    this.productlist(this.currentPage, this.pageSize);
    this.changeDetectorRef.detectChanges();
  }

  private applyRestoreScrollOnce(): void {
    if (!this.didApplyScroll && this.restoreScrollY > 0) {
      const apply = () => {
        let attempts = 0;
        const target = this.restoreScrollY;
        const tryScroll = () => {
          attempts++;
          window.scrollTo({ top: target, behavior: 'auto' });
          if (document.scrollingElement) {
            (document.scrollingElement as HTMLElement).scrollTop = target;
          }
          const container = document.querySelector('.table-responsive') as HTMLElement ||
                            document.querySelector('.mat-table') as HTMLElement ||
                            document.querySelector('.content') as HTMLElement;
          if (container) {
            container.scrollTop = target;
          }
          const applied = Math.abs((window.scrollY || 0) - target) < 5 ||
                          (document.scrollingElement && Math.abs((document.scrollingElement as HTMLElement).scrollTop - target) < 5) ||
                          (container && Math.abs(container.scrollTop - target) < 5);
          if (!applied && attempts < 10) {
            requestAnimationFrame(tryScroll);
          } else {
            this.restoreScrollY = 0;
            this.didApplyScroll = true;
            if (localStorage.getItem('admin_prod_scrollY')) {
              localStorage.removeItem('admin_prod_scrollY');
            }
          }
        };
        requestAnimationFrame(tryScroll);
      };
      const sub = this.ngZone.onStable.subscribe(() => {
        sub.unsubscribe();
        setTimeout(apply, 0);
      });
    }
  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    if(localStorage.getItem('admin_prod_page') != null)
    {
      this.currentPage = parseInt(localStorage.getItem('admin_prod_page'));
    }
    if(localStorage.getItem('admin_prod_pageSize') != null){
      const ps = parseInt(localStorage.getItem('admin_prod_pageSize') || '10', 10);
      this.pageSize = isNaN(ps) ? this.pageSize : ps;
    }
    if(localStorage.getItem('admin_prod_search') != null){
      this.restoreSearch = localStorage.getItem('admin_prod_search') || '';
    }
    if(localStorage.getItem('admin_prod_scrollY') != null){
      const raw = localStorage.getItem('admin_prod_scrollY') || '0';
      const match = raw.match(/-?\d+/);
      const y = match ? parseInt(match[0], 10) : 0;
      this.restoreScrollY = isNaN(y) ? 0 : y;
    }
    this.didApplyScroll = false;
    this.productlist(this.currentPage, this.pageSize);
    if (this.userrole === 'admin') {
      this.loadAdminPendingDf();
    }
    this.loadVendorMTGs();

    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::", this.vendorType);
  }

  onPlatformToggleChange() {
    this.currentPage = 0;
    if (this.showPlatformProducts) {
      this.loadPlatformProducts();
      return;
    }
    this.productlist(this.currentPage, this.pageSize);
  }

  loadPlatformProducts() {
    this.isPlatformLoading = true;
    this.productservice.getPlatformAllProducts({
      page: this.currentPage + 1,
      limit: this.pageSize
    }).subscribe(
      res => {
        this.platformProducts = (res?.data?.products || []).map((product: any) => ({
          ...product,
          vendor_mtg_id: this.normalizeMtgId(product.vendor_mtg_id)
        }));
        this.totalProduct = res?.data?.totalCount || this.platformProducts.length;
        this.dataSource.data = this.platformProducts.map((p: any) => ({
          ...p,
          product_image: p.product_image?.length > 0 ? p.product_image[0].pro_image : 'assets/images/cat3.png'
        }));
        this.isPlatformLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error => {
        this.isPlatformLoading = false;
        this.toastrService.error(error?.error?.message || 'Unable to load platform products');
      }
    );
  }

  loadVendorMTGs() {
    this.isVendorMtgLoading = true;
    this.productservice.getVendorMTGList(1, 500).subscribe(
      res => {
        const list = res?.data?.vendorMediaList || [];
        this.vendorMTGs = list.filter((mtg: any) =>
          mtg?.status === 'active' && (mtg?.mtg_status === 'active' || !mtg?.mtg_status)
        );
        this.isVendorMtgLoading = false;
      },
      () => {
        this.vendorMTGs = [];
        this.isVendorMtgLoading = false;
      }
    );
  }

  private normalizeMtgId(rawMtgId: any): string | null {
    if (!rawMtgId) {
      return null;
    }
    if (typeof rawMtgId === 'string') {
      return rawMtgId;
    }
    if (rawMtgId?._id) {
      return rawMtgId._id;
    }
    return null;
  }

  getDfBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'label p-1 label-success';
      case 'pending':
        return 'label p-1 label-warning';
      case 'inactive':
        return 'label p-1 label-danger';
      default:
        return 'label p-1 label-default';
    }
  }

  togglePlatformDisplayer(product: any) {
    const nextStatus = product.vendor_displayer_status === 'none' ? 'active' : 'none';
    this.savePlatformDf(product, { displayer_status: nextStatus });
  }

  togglePlatformFulfiller(product: any) {
    const nextStatus = product.vendor_fulfiller_status === 'none' ? 'active' : 'none';
    if (nextStatus !== 'none' && (!product.vendor_sales_price || Number(product.vendor_sales_price) <= 0)) {
      this.toastrService.error('Vendor price is required to request fulfiller status');
      return;
    }
    this.savePlatformDf(product, {
      fulfiller_status: nextStatus,
      vendor_sales_price: product.vendor_sales_price
    });
  }

  savePlatformVendorPrice(product: any) {
    const value = Number(product.vendor_sales_price);
    if (!value || value <= 0) {
      this.toastrService.error('Please enter a valid vendor price');
      return;
    }
    this.savePlatformDf(product, { vendor_sales_price: value });
  }

  togglePlatformMultiVendorSupport(product: any) {
    this.savePlatformDf(product, {
      multi_vendor_support: product.vendor_multi_vendor_support === true
    });
  }

  savePlatformMtg(product: any) {
    this.savePlatformDf(product, {
      mtg_id: product.vendor_mtg_id || null
    });
  }

  private savePlatformDf(product: any, payload: any) {
    this.savingPlatformProductId = product._id;
    this.productservice.updateDisplayerFulfiller(product._id, payload).subscribe(
      () => {
        this.toastrService.success('Request saved and sent for admin approval');
        this.savingPlatformProductId = null;
        this.loadPlatformProducts();
      },
      error => {
        this.savingPlatformProductId = null;
        this.toastrService.error(error?.error?.message || 'Unable to save request');
      }
    );
  }

  loadAdminPendingDf() {
    this.loadingAdminPendingDf = true;
    this.productservice.getPendingDisplayerFulfillers().subscribe(
      res => {
        this.adminPendingDfEntries = res?.data?.pendingEntries || [];
        this.loadingAdminPendingDf = false;
      },
      error => {
        this.loadingAdminPendingDf = false;
      }
    );
  }

  updateAdminDf(entry: any, payload: any) {
    const vendorId = entry?.vendor_id?._id || entry?.vendor_id;
    this.productservice.updateAdminDisplayerFulfillerStatus(entry.product_id, vendorId, payload).subscribe(
      () => {
        this.toastrService.success('Pending request updated');
        this.loadAdminPendingDf();
      },
      error => {
        this.toastrService.error(error?.error?.message || 'Unable to update request');
      }
    );
  }

  productlist(page: number, pageSize: number) {
    const startedAt = performance.now();
    this.lastListAt = startedAt;
    this.productservice.allProductlist(page + 1, pageSize).subscribe(
      res => {
        // If a search started after this list call, do not apply this response
        if (this.lastSearchAt && this.lastSearchAt > startedAt) {
          return;
        }
        this.product_list = res['data'].products;
        this.totalProduct = res['data'].totalRecords;
        this.checkCopiedProducts(this.product_list);
        this.dataSource.data = this.product_list.map(product => ({
          ...product,
          product_image: product.product_image.length > 0 ? product.product_image[0].pro_image : 'assets/images/cat3.png'
        }));
        this.applyRestoreScrollOnce();
        this.isSearching = false;
        this.changeDetectorRef.detectChanges();
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
    if (this.searchInput && this.restoreSearch) {
      setTimeout(() => {
        this.searchInput.nativeElement.value = this.restoreSearch;
        this.currentSearch = this.restoreSearch;
        // Always trigger search on restore so results match the shown term
        this.triggerSearch(this.restoreSearch, true);
        this.searchInput.nativeElement.focus();
        // Clear applied keys now (keep scroll until applied later)
        if (localStorage.getItem('admin_prod_search')) {
          localStorage.removeItem('admin_prod_search');
        }
        if (localStorage.getItem('admin_prod_page')) {
          localStorage.removeItem('admin_prod_page');
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
    if (this.currentSearch && this.currentSearch.trim().length > 0) {
      if (this.paginator) {
        this.paginator.length = this.totalProduct;
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = this.totalProduct;
      }
      this.currentPage = 0;
      this.pageSize = this.totalProduct;
      this.dataSource.data = this.searchResultsAll;
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    if (this.showPlatformProducts) {
      this.loadPlatformProducts();
    } else {
      this.productlist(this.currentPage, this.pageSize);
    }
    localStorage.setItem('admin_prod_pageSize', this.pageSize.toString());
    if (this.searchInput) {
      setTimeout(() => this.searchInput.nativeElement.focus());
    }
  }


  statusChange(renderValue: any, product) {
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
        this.toastrService.success('Product Updated', 'Success');
        this.router.navigateByUrl('/vendors/create-vendors', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/vendors/vendor-product-list/' + product.product_owner._id]);
        });
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );


  }

  checkCopiedProducts(products: any[]) {
    for (let product of products) {
      if (product.copied_by_vendors && product.copied_by_vendors.length > 0) {
        this.hideCopyButton = true;
        break; // Stop the loop as soon as a copied product is found
      }
    }
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
        if (elapsedTime >= 600) {  // 0.6s delay
          this.ngZone.run(() => {
            if (filterValue.length > 0) {
              this.triggerSearch(filterValue, true);
            } else {
              // Reset paginator to first page and load normal list
              this.currentPage = 0;
              if (this.paginator) {
                this.paginator.firstPage();
              }
              this.productlist(this.currentPage, this.pageSize);
            }
          });
        } else {
          this.searchTimeout = requestAnimationFrame(checkTime);
        }
      };
      this.searchTimeout = requestAnimationFrame(checkTime);
    });
  }

  // Additional API request function for search (single-page results)
  triggerSearch(filterValue: string, resetPage: boolean = false): void {
    this.isSearching = true;
    const startedAt = performance.now();
    this.lastSearchAt = startedAt;
    this.productservice.searchProductlist(filterValue).subscribe(res => {
      if (res && res['data']) {
        // Ignore if a newer full-list request completed after this search started
        if (this.lastListAt && this.lastListAt > startedAt) {
          return;
        }
        const product_list = res['data'].products || [];
        this.searchResultsAll = product_list.map(product => ({
          ...product,
          product_image: product.product_image && product.product_image.length > 0 ? product.product_image[0].pro_image : 'assets/images/cat3.png'
        }));
        this.totalProduct = this.searchResultsAll.length;
        this.currentPage = 0;
        this.pageSize = this.totalProduct;
        this.dataSource.data = this.searchResultsAll;
        this.applyRestoreScrollOnce();
        if (this.paginator) {
          this.paginator.length = this.totalProduct;
          this.paginator.pageIndex = 0;
          this.paginator.pageSize = this.totalProduct;
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }


  copyProduct() {
    this.dialog.open(this.productCopy, { disableClose: false })
  }


  pendingProductList() {
    this.router.navigate(['/products/pending-product-list']);
  }

  approvedProductList()
  {
    this.router.navigate(['/products/approve-product-list']);
  }

  productCopyConfirm() {
    this.productservice.cloneAllProducts().subscribe(
      res => {
        this.toastrService.success(res['message'])
        this.productlist(this.currentPage, this.pageSize);
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    )
  }

  edit(product: any) {
    this.router.navigate(['/products/edit-product/' + product.product_slug]);
    localStorage.setItem('admin_prod_page', this.currentPage.toString());
    localStorage.setItem('admin_prod_pageSize', this.pageSize.toString());
    localStorage.setItem('admin_prod_search', this.currentSearch || '');
    localStorage.setItem('admin_prod_scrollY', `scrollY: ${window.scrollY || 0}`);
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
