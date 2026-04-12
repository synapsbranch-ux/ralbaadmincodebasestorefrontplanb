import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { AddStoreComponent } from './add-store/add-store.component';
import { EditStoreComponent } from './edit-store/edit-store.component';
import { ListStoreComponent } from './list-store/list-store.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-store',
        component: ListStoreComponent,canActivate: [AuthGuard],
        data: {
          title: "List Store",
          breadcrumb: "List Store"
        }
      },    
      {
        path: 'add-store',
        component: AddStoreComponent,canActivate: [AuthGuard],
        data: {
          title: "Add Store",
          breadcrumb: "Add Store"
        }
      }, 
      {
        path: 'edit-store/:id',
        component: EditStoreComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Store",
          breadcrumb: "Edit Store"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
