import { Component, OnInit } from '@angular/core';
import { MultistorePortalService } from '../multistore-portal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-platform-products',
    templateUrl: './platform-products.component.html'
})
export class PlatformProductsComponent implements OnInit {

    products: any[] = [];
    vendorMTGs: any[] = [];
    isLoading = false;
    isVendorMtgLoading = false;
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
        this.loadVendorMTGs();
    }

    loadProducts() {
        this.isLoading = true;
        this.multistoreService.getPlatformAllProducts({
            page: this.currentPage,
            limit: this.pageSize
        }).subscribe(
            res => {
                this.products = (res.data?.products || []).map((product: any) => ({
                    ...product,
                    vendor_mtg_id: this.normalizeMtgId(product.vendor_mtg_id)
                }));
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

    loadVendorMTGs() {
        this.isVendorMtgLoading = true;
        this.multistoreService.getVendorMTGList(1, 500).subscribe(
            (res) => {
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

    toggleMultiVendorSupport(product: any) {
        this.saveDF(product, {
            multi_vendor_support: product.vendor_multi_vendor_support === true
        });
    }

    saveProductMtg(product: any) {
        this.saveDF(product, {
            mtg_id: product.vendor_mtg_id || null
        });
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
