import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { ListAddonsCategoryComponent } from './list-addons-category/list-addons-category.component';
import { EditAddonsComponent } from './edit-addons/edit-addons.component';
import { venortypeauthGuard } from '../auth/_service/venortypeauth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-addons-category',
        component: ListAddonsCategoryComponent,canActivate: [AuthGuard],
        data: {
          title: "List Addons Category",
          breadcrumb: "List Addons Category"
        }
      },
      {
        path: 'edit-addons-category/:id',
        component: EditAddonsComponent,canActivate: [AuthGuard,venortypeauthGuard],
        data: {
          title: "Edit Addons Category",
          breadcrumb: "Edit Addons Category"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddonsCategoryRoutingModule { }
