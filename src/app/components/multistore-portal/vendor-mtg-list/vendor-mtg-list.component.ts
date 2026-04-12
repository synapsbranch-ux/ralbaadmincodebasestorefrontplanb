import { Component, OnInit } from '@angular/core';
import { MultistorePortalService } from '../multistore-portal.service';
import { MediaTextContentService } from '../../media-text-content/media-text-content.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-vendor-mtg-list',
    templateUrl: './vendor-mtg-list.component.html'
})
export class VendorMtgListComponent implements OnInit {

    vendorMTGs: any[] = [];
    isLoading = false;

    // Create form
    showCreateForm = false;
    newMTG = { heading_text: '', description_text: '', section_image: '', tags: [] };
    isCreating = false;
    imageFile: File = null;

    constructor(
        private multistoreService: MultistorePortalService,
        private mediaTextService: MediaTextContentService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.loadVendorMTGs();
    }

    loadVendorMTGs() {
        this.isLoading = true;
        this.mediaTextService.allVendorMediaTextContentlist(1, 100).subscribe(
            res => {
                this.vendorMTGs = res.data?.vendorMediaList || [];
                this.isLoading = false;
            },
            err => {
                this.toastr.error('Error loading MTGs');
                this.isLoading = false;
            }
        );
    }

    onImageSelected(event: any) {
        if (event.target.files && event.target.files[0]) {
            this.imageFile = event.target.files[0];
        }
    }

    createMTG() {
        if (!this.newMTG.heading_text || !this.newMTG.description_text) {
            this.toastr.error('Heading and description are required');
            return;
        }

        if (!this.imageFile && !this.newMTG.section_image) {
            this.toastr.error('Image is required');
            return;
        }

        this.isCreating = true;

        if (this.imageFile) {
            this.mediaTextService.uploadVendorImage(this.imageFile).subscribe(
                uploadRes => {
                    this.newMTG.section_image = uploadRes.data?.image || uploadRes.data;
                    this.submitCreateMTG();
                },
                err => {
                    this.toastr.error('Image upload failed');
                    this.isCreating = false;
                }
            );
        } else {
            this.submitCreateMTG();
        }
    }

    private submitCreateMTG() {
        this.multistoreService.createVendorMTG(this.newMTG).subscribe(
            res => {
                this.toastr.success('MTG created! Pending admin approval.');
                this.showCreateForm = false;
                this.newMTG = { heading_text: '', description_text: '', section_image: '', tags: [] };
                this.imageFile = null;
                this.isCreating = false;
                this.loadVendorMTGs();
            },
            err => {
                this.toastr.error(err.error?.message || 'Error creating MTG');
                this.isCreating = false;
            }
        );
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'active': return 'badge bg-success';
            case 'pending': return 'badge bg-warning text-dark';
            case 'inactive': return 'badge bg-secondary';
            default: return 'badge bg-light';
        }
    }
}
