
import { HomeBannerModule } from './components/home-banner/home-banner.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './components/products/products.module';
import { SalesModule } from './components/sales/sales.module';
import { VendorsModule } from './components/vendors/vendors.module';
import { UsersModule } from './components/users/users.module';
import { SettingModule } from './components/setting/setting.module';;
import { AuthModule } from './components/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RoomsModule } from './components/rooms/rooms.module';
import { OrderModule } from './components/order-management/order.module'
import { HttpErrorInterceptor } from './http-error.interceptor';
import { DepartmentModule } from './components/departments/department.module';
import { StoreModule } from './components/stores/store.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageGuidlineModule } from './components/image-guideline/image-guideline.module';
import { CatagoriesModule } from './components/catagories/catagories.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    SettingModule,
    AuthModule,
    SharedModule,
    ProductsModule,
    SalesModule,
    VendorsModule,
    UsersModule,
    HttpClientModule,
    RoomsModule,
    OrderModule,
    DepartmentModule,
    StoreModule,
    ToastrModule.forRoot({
      timeOut: 60000,
      progressBar: false,
      enableHtml: true,
    }),
    NgbModule,
    ImageGuidlineModule,
    HomeBannerModule,
    CatagoriesModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
