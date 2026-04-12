import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { VendorMtgListComponent } from './vendor-mtg-list/vendor-mtg-list.component';
import { PlatformMtgListComponent } from './platform-mtg-list/platform-mtg-list.component';
import { PlatformProductsComponent } from './platform-products/platform-products.component';
import { AdminPendingMtgComponent } from './admin-pending-mtg/admin-pending-mtg.component';
import { AdminPendingDfComponent } from './admin-pending-df/admin-pending-df.component';

const routes: Routes = [
    {
        path: '',
        children: [
            // Vendor routes
            {
                path: 'my-mtgs',
                component: VendorMtgListComponent,
                canActivate: [AuthGuard],
                data: { title: 'My MTGs', breadcrumb: 'My MTGs' }
            },
            {
                path: 'platform-mtgs',
                component: PlatformMtgListComponent,
                canActivate: [AuthGuard],
                data: { title: 'Platform MTGs', breadcrumb: 'Platform MTGs' }
            },
            {
                path: 'platform-products',
                component: PlatformProductsComponent,
                canActivate: [AuthGuard],
                data: { title: 'Platform Products', breadcrumb: 'Platform Products' }
            },
            // Admin routes
            {
                path: 'pending-mtgs',
                component: AdminPendingMtgComponent,
                canActivate: [AuthGuard],
                data: { title: 'Pending MTG Approvals', breadcrumb: 'Pending MTGs' }
            },
            {
                path: 'pending-displayer-fulfiller',
                component: AdminPendingDfComponent,
                canActivate: [AuthGuard],
                data: { title: 'Pending DF Approvals', breadcrumb: 'Pending Displayer-Fulfiller' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MultistorePortalRoutingModule {}
