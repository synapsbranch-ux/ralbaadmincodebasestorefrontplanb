import { VendorChangeComponent } from './vendor-changepassword/vendor-changepassword.component';
import { AdminChangeComponent } from './admin-changepassword/admin-changepassword.component';
import { EditSettingsComponent } from './update-settings/update-settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { UpdateShippingTaxComponent } from './update-shipping-tax/update-shipping-tax.component';
import { CommissionSetupComponent } from './commission-setup/commission-setup.component';
import { ReturnDurationComponent } from './return-duration/return-duration.component';


const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,canActivate: [AuthGuard],
    data: {
      title: "Profile",
      breadcrumb: "Profile"
    }
  },
  {
    path: 'edit-settings',
    component: EditSettingsComponent,canActivate: [AuthGuard],
    data: {
      title: "Edit Settings",
      breadcrumb: "Edit Settings"
    }
  },
  {
    path: 'edit-shipping-tax',
    component: UpdateShippingTaxComponent,canActivate: [AuthGuard],
    data: {
      title: "Edit Shipping Tax",
      breadcrumb: "Edit Shipping Tax"
    }
  },
  {
    path: 'edit-commission',
    component: CommissionSetupComponent,canActivate: [AuthGuard],
    data: {
      title: "Edit Commission",
      breadcrumb: "Edit Commission"
    }
  },
  {
    path:'admin-change-password',
    component:AdminChangeComponent,
    data: {
      title: "Change Password",
      breadcrumb: "Change Password"
    }
  },
  {
    path:'vendor-change-password',
    component:VendorChangeComponent,
    data: {
      title: "Change Password",
      breadcrumb: "Change Password"
    }
  },
  {
    path: 'edit-return-duration',
    component: ReturnDurationComponent,canActivate: [AuthGuard],
    data: {
      title: "Edit Return Duration",
      breadcrumb: "Edit Return Duration"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
