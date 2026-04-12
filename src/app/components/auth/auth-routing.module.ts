import { VendorForgotComponent } from './vendor-forgotpassword/vendor-forgotpassword.component';
import { AdminForgotComponent } from './admin-forgotpassword/admin-forgotpassword.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path:'login',
        component:LoginComponent,
        data: {
          title: "Admin Login",
          breadcrumb: "Admin Login"
        }
      },
      {
        path:'vendor-login',
        component:VendorLoginComponent,
        data: {
          title: "Vendor Login",
          breadcrumb: "Vendor Login"
        }
      },
      {
        path:'privacy-policy',
        component:PrivacyPolicyComponent,
        data: {
          title: "Privacy Policy",
          breadcrumb: "Privacy Policy"
        }
      },
      {
        path:'admin-forgot-password',
        component:AdminForgotComponent,
        data: {
          title: "Admin Forgot Password",
          breadcrumb: "Admin Forgot Password"
        }
      },
      {
        path:'vendor-forgot-password',
        component:VendorForgotComponent,
        data: {
          title: "Vendor Forgot Password",
          breadcrumb: "Vendor Forgot Password"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
