import { EditHomeBannerComponent } from './edit-home-banner/edit-home-banner.component';
import { AddHomeBannerComponent } from './add-home-banner/add-home-banner.component';
import { ListHomeBannerComponent } from './list-home-banner/list-home-banner.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-home-banner',
        component: ListHomeBannerComponent,canActivate: [AuthGuard],
        data: {
          title: "List Home Banner",
          breadcrumb: "List Home Banner"
        }
      },    
      {
        path: 'add-home-banner',
        component: AddHomeBannerComponent,canActivate: [AuthGuard],
        data: {
          title: "Add Home Banner",
          breadcrumb: "Add Home Banner"
        }
      }, 
      {
        path: 'edit-home-banner/:id',
        component: EditHomeBannerComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Home Banner",
          breadcrumb: "Edit Home Banner"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeBannerRoutingModule { }
