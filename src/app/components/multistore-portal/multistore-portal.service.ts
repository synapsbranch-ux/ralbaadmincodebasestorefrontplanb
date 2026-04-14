import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/security.service';

@Injectable({
    providedIn: 'root'
})
export class MultistorePortalService {

    constructor(private http: HttpClient, private securityService: SecurityService) {}

    // ============== MTG Endpoints ==============

    /** Platform MTG list (active MTGs) */
    getPlatformMTGList(): Observable<any> {
        const url = environment.baseUrl + 'mtg/platform-list';
        return this.securityService.signedRequest('GET', url);
    }

    /** Create a new vendor MTG (status: pending) */
    createVendorMTG(data: any): Observable<any> {
        const url = environment.baseUrl + 'mtg/vendor/create';
        return this.securityService.signedRequest('POST', url, data);
    }

    /** Add an existing platform MTG to vendor's store */
    addMTGToVendorStore(data: any): Observable<any> {
        const url = environment.baseUrl + 'mtg/vendor/add-to-store';
        return this.securityService.signedRequest('POST', url, data);
    }

    /** Upload MTG image (reuse vendor media-text-content upload) */
    uploadMTGImage(fileToUpload: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name);
        const url = environment.baseUrl + 'vendor/media-text-content/imageupload';
        return this.securityService.signedRequest('POST', url, formData);
    }

    // ============== Product Displayer-Fulfiller Endpoints ==============

    /** Get all platform products with vendor's DF status */
    getPlatformAllProducts(data: any): Observable<any> {
        const url = environment.baseUrl + 'products/platform-all';
        return this.securityService.signedRequest('POST', url, data);
    }

    /** Update vendor's displayer/fulfiller status for a product */
    updateDisplayerFulfiller(productId: string, data: any): Observable<any> {
        const url = environment.baseUrl + `products/${productId}/displayer-fulfiller`;
        return this.securityService.signedRequest('PATCH', url, data);
    }

    // ============== Admin Approval Endpoints ==============

    /** Admin: Get pending MTGs */
    getAdminPendingMTGs(): Observable<any> {
        const url = environment.baseUrl + 'admin/mtg/pending';
        return this.securityService.signedRequest('GET', url);
    }

    /** Admin: Update MTG status (approve/reject) */
    updateMTGStatus(mtgId: string, data: any): Observable<any> {
        const url = environment.baseUrl + `admin/mtg/${mtgId}/status`;
        return this.securityService.signedRequest('PATCH', url, data);
    }

    /** Admin: Get pending displayer-fulfiller entries */
    getAdminPendingDisplayerFulfillers(): Observable<any> {
        const url = environment.baseUrl + 'admin/products/displayer-fulfiller/pending';
        return this.securityService.signedRequest('GET', url);
    }

    /** Admin: Update displayer-fulfiller status (approve/reject) */
    updateDisplayerFulfillerStatus(productId: string, vendorId: string, data: any): Observable<any> {
        const url = environment.baseUrl + `admin/products/${productId}/displayer-fulfiller/${vendorId}`;
        return this.securityService.signedRequest('PATCH', url, data);
    }
}
