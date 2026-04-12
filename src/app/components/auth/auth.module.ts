
import { VendorForgotComponent } from './vendor-forgotpassword/vendor-forgotpassword.component';
import { AdminForgotComponent } from './admin-forgotpassword/admin-forgotpassword.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '../../shared/shared.module';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';


@NgModule({
  declarations: [LoginComponent, VendorLoginComponent, AdminForgotComponent, VendorForgotComponent,PrivacyPolicyComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgbNavModule,
    CarouselModule,
    SharedModule,
    FormsModule,
    NgOtpInputModule
  ]
})
export class AuthModule { }
