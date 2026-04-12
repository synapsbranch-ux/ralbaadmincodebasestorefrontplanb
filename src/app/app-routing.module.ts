import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { VendorLoginComponent } from './components/auth/vendor-login/vendor-login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from '../app/components/auth/_service/auth-guard.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'vendor-login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: content
  },
  {
    path: 'dashboard',
    component: DashboardComponent,canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'vendor-login',
    component: VendorLoginComponent,
  },
  {
    path: 'SidebarComponent',canActivate: [AuthGuard],
    component: SidebarComponent,

  }
];

const routerOptions: ExtraOptions = {
  initialNavigation: 'enabledBlocking',  // or 'enabled' or 'disabled'
  useHash: false,
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
