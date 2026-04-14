import { Component, OnInit } from '@angular/core';
import { MultistorePortalService } from '../multistore-portal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-platform-products',
    templateUrl: './platform-products.component.html'
})
export class PlatformProductsComponent implements OnInit {

    products: any[] = [];
    isLoading = false;
    currentPage = 1;
    totalPages = 1;
    totalCount = 0;
    pageSize = 20;
    savingProductId: string | null = null;

    constructor(
        private multistoreService: MultistorePortalService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.isLoading = true;
        this.multistoreService.getPlatformAllProducts({
            page: this.currentPage,
            limit: this.pageSize
        }).subscribe(
            res => {
                this.products = res.data?.products || [];
                this.totalCount = res.data?.totalCount || 0;
                this.totalPages = res.data?.totalPages || 1;
                this.isLoading = false;
            },
            err => {
                this.toastr.error('Error loading products');
                this.isLoading = false;
            }
        );
    }

    toggleDisplayer(product: any) {
        const newStatus = product.vendor_displayer_status === 'none' ? 'pending' : 'none';
        this.saveDF(product, { displayer_status: newStatus });
    }

    toggleFulfiller(product: any) {
        const newStatus = product.vendor_fulfiller_status === 'none' ? 'pending' : 'none';
        if (newStatus !== 'none' && !product.vendor_sales_price) {
            this.toastr.error('Please set a vendor price first');
            return;
        }
        this.saveDF(product, { fulfiller_status: newStatus, vendor_sales_price: product.vendor_sales_price });
    }

    saveVendorPrice(product: any) {
        if (!product.vendor_sales_price || product.vendor_sales_price <= 0) {
            this.toastr.error('Please enter a valid price');
            return;
        }
        this.saveDF(product, { vendor_sales_price: product.vendor_sales_price });
    }

    private saveDF(product: any, data: any) {
        this.savingProductId = product._id;

        this.multistoreService.updateDisplayerFulfiller(product._id, data).subscribe(
            res => {
                this.toastr.success('Updated! Pending admin approval.');
                this.savingProductId = null;
                this.loadProducts();
            },
            err => {
                this.toastr.error(err.error?.message || 'Error updating');
                this.savingProductId = null;
            }
        );
    }

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadProducts();
        }
    }

    getStatusBadge(status: string): string {
        switch (status) {
            case 'active': return 'badge bg-success';
            case 'pending': return 'badge bg-warning text-dark';
            case 'inactive': return 'badge bg-danger';
            default: return 'badge bg-light text-dark';
        }
    }
}
