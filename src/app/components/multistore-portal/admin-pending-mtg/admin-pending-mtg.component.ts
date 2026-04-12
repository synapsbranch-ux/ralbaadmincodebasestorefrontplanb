import { Component, OnInit } from '@angular/core';
import { MultistorePortalService } from '../multistore-portal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-pending-mtg',
    templateUrl: './admin-pending-mtg.component.html'
})
export class AdminPendingMtgComponent implements OnInit {

    pendingMTGs: any[] = [];
    isLoading = false;
    processingId: string | null = null;

    constructor(
        private multistoreService: MultistorePortalService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.loadPendingMTGs();
    }

    loadPendingMTGs() {
        this.isLoading = true;
        this.multistoreService.getAdminPendingMTGs().subscribe(
            res => {
                this.pendingMTGs = res.data?.pendingMTGs || [];
                this.isLoading = false;
            },
            err => {
                this.toastr.error('Error loading pending MTGs');
                this.isLoading = false;
            }
        );
    }

    approveMTG(mtg: any) {
        this.processingId = mtg._id;
        this.multistoreService.updateMTGStatus(mtg._id, { mtg_status: 'active' }).subscribe(
            res => {
                this.toastr.success('MTG approved!');
                this.processingId = null;
                this.pendingMTGs = this.pendingMTGs.filter(m => m._id !== mtg._id);
            },
            err => {
                this.toastr.error('Error approving MTG');
                this.processingId = null;
            }
        );
    }

    rejectMTG(mtg: any) {
        this.processingId = mtg._id;
        this.multistoreService.updateMTGStatus(mtg._id, { mtg_status: 'inactive' }).subscribe(
            res => {
                this.toastr.success('MTG rejected');
                this.processingId = null;
                this.pendingMTGs = this.pendingMTGs.filter(m => m._id !== mtg._id);
            },
            err => {
                this.toastr.error('Error rejecting MTG');
                this.processingId = null;
            }
        );
    }
}
