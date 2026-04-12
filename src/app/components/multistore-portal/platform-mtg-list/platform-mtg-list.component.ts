import { Component, OnInit } from '@angular/core';
import { MultistorePortalService } from '../multistore-portal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-platform-mtg-list',
    templateUrl: './platform-mtg-list.component.html'
})
export class PlatformMtgListComponent implements OnInit {

    platformMTGs: any[] = [];
    isLoading = false;
    addingMTGId: string | null = null;
    addedMTGIds: Set<string> = new Set();

    constructor(
        private multistoreService: MultistorePortalService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.loadPlatformMTGs();
    }

    loadPlatformMTGs() {
        this.isLoading = true;
        this.multistoreService.getPlatformMTGList().subscribe(
            res => {
                this.platformMTGs = res.data?.mtgList || [];
                this.isLoading = false;
            },
            err => {
                this.toastr.error('Error loading platform MTGs');
                this.isLoading = false;
            }
        );
    }

    addToMyStore(mtg: any) {
        const vendorId = localStorage.getItem('user_id');
        if (!vendorId) {
            this.toastr.error('Vendor ID not found');
            return;
        }

        this.addingMTGId = mtg._id;
        this.multistoreService.addMTGToVendorStore({
            vendor_id: vendorId,
            media_text_contain_id: mtg._id
        }).subscribe(
            res => {
                this.toastr.success('MTG added to your store!');
                this.addedMTGIds.add(mtg._id);
                this.addingMTGId = null;
            },
            err => {
                this.toastr.error(err.error?.message || 'Error adding MTG');
                if (err.error?.message?.includes('already added')) {
                    this.addedMTGIds.add(mtg._id);
                }
                this.addingMTGId = null;
            }
        );
    }

    getVendorName(mtg: any): string {
        if (mtg.vendor_id && mtg.vendor_id.name) {
            return mtg.vendor_id.name;
        }
        return 'Platform';
    }
}
