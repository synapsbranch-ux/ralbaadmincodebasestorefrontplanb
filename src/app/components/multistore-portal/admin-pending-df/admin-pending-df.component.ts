import { Component, OnInit } from '@angular/core';
import { MultistorePortalService } from '../multistore-portal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-pending-df',
    templateUrl: './admin-pending-df.component.html'
})
export class AdminPendingDfComponent implements OnInit {

    pendingEntries: any[] = [];
    isLoading = false;
    processingKey: string | null = null;

    constructor(
        private multistoreService: MultistorePortalService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.loadPendingEntries();
    }

    loadPendingEntries() {
        this.isLoading = true;
        this.multistoreService.getAdminPendingDisplayerFulfillers().subscribe(
            res => {
                this.pendingEntries = res.data?.pendingEntries || [];
                this.isLoading = false;
            },
            err => {
                this.toastr.error('Error loading pending entries');
                this.isLoading = false;
            }
        );
    }

    private getKey(entry: any): string {
        return `${entry.product_id}_${entry.vendor_id?._id || entry.vendor_id}`;
    }

    approveDisplayer(entry: any) {
        this.processingKey = this.getKey(entry);
        const vendorId = entry.vendor_id?._id || entry.vendor_id;
        this.multistoreService.updateDisplayerFulfillerStatus(entry.product_id, vendorId, {
            displayer_status: 'active'
        }).subscribe(
            res => {
                this.toastr.success('Displayer approved!');
                this.processingKey = null;
                this.loadPendingEntries();
            },
            err => {
                this.toastr.error('Error approving displayer');
                this.processingKey = null;
            }
        );
    }

    rejectDisplayer(entry: any) {
        this.processingKey = this.getKey(entry);
        const vendorId = entry.vendor_id?._id || entry.vendor_id;
        this.multistoreService.updateDisplayerFulfillerStatus(entry.product_id, vendorId, {
            displayer_status: 'inactive'
        }).subscribe(
            res => {
                this.toastr.success('Displayer rejected');
                this.processingKey = null;
                this.loadPendingEntries();
            },
            err => {
                this.toastr.error('Error rejecting displayer');
                this.processingKey = null;
            }
        );
    }

    approveFulfiller(entry: any) {
        this.processingKey = this.getKey(entry);
        const vendorId = entry.vendor_id?._id || entry.vendor_id;
        this.multistoreService.updateDisplayerFulfillerStatus(entry.product_id, vendorId, {
            fulfiller_status: 'active'
        }).subscribe(
            res => {
                this.toastr.success('Fulfiller approved!');
                this.processingKey = null;
                this.loadPendingEntries();
            },
            err => {
                this.toastr.error('Error approving fulfiller');
                this.processingKey = null;
            }
        );
    }

    rejectFulfiller(entry: any) {
        this.processingKey = this.getKey(entry);
        const vendorId = entry.vendor_id?._id || entry.vendor_id;
        this.multistoreService.updateDisplayerFulfillerStatus(entry.product_id, vendorId, {
            fulfiller_status: 'inactive'
        }).subscribe(
            res => {
                this.toastr.success('Fulfiller rejected');
                this.processingKey = null;
                this.loadPendingEntries();
            },
            err => {
                this.toastr.error('Error rejecting fulfiller');
                this.processingKey = null;
            }
        );
    }

    getRequestType(entry: any): string {
        const types = [];
        if (entry.displayer_status === 'pending') types.push('Displayer');
        if (entry.fulfiller_status === 'pending') types.push('Fulfiller');
        return types.join(' + ') || 'N/A';
    }

    isProcessing(entry: any): boolean {
        return this.processingKey === this.getKey(entry);
    }
}
