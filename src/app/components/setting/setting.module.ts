import { VendorChangeComponent } from './vendor-changepassword/vendor-changepassword.component';
import { AdminChangeComponent } from './admin-changepassword/admin-changepassword.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { SettingRoutingModule } from './setting-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../../shared/shared.module';
import { UpdateShippingTaxComponent } from './update-shipping-tax/update-shipping-tax.component';
import { CommissionSetupComponent } from './commission-setup/commission-setup.component';
import { ReturnDurationComponent } from './return-duration/return-duration.component';

@NgModule({
  declarations: [ProfileComponent,AdminChangeComponent,VendorChangeComponent,UpdateShippingTaxComponent,CommissionSetupComponent,ReturnDurationComponent],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    SettingRoutingModule,
    SharedModule
  ]
})
export class SettingModule { }
