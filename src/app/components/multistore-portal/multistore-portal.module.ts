import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultistorePortalRoutingModule } from './multistore-portal-routing.module';
import { MultistorePortalService } from './multistore-portal.service';

// Vendor components
import { VendorMtgListComponent } from './vendor-mtg-list/vendor-mtg-list.component';
import { PlatformMtgListComponent } from './platform-mtg-list/platform-mtg-list.component';
import { PlatformProductsComponent } from './platform-products/platform-products.component';

// Admin components
import { AdminPendingMtgComponent } from './admin-pending-mtg/admin-pending-mtg.component';
import { AdminPendingDfComponent } from './admin-pending-df/admin-pending-df.component';

@NgModule({
    declarations: [
        VendorMtgListComponent,
        PlatformMtgListComponent,
        PlatformProductsComponent,
        AdminPendingMtgComponent,
        AdminPendingDfComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MultistorePortalRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [MultistorePortalService]
})
export class MultistorePortalModule {}
