import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserOrderListComponent } from './user-order-list/user-order-list.component';
import { VendorOrderListComponent } from '../vendors/vendor-order-list/vendor-order-list.component';
import { ReturnListComponent } from './return-list/return-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-user',
        component: ListUserComponent,canActivate: [AuthGuard],
        data: {
          title: "User List",
          breadcrumb: "User List"
        }
      },
      {
        path: 'create-user',
        component: CreateUserComponent,canActivate: [AuthGuard],
        data: {
          title: "Create User",
          breadcrumb: "Create User"
        }
      },
      {
        path: 'edit-user/:id',
        component: EditUserComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit User",
          breadcrumb: "Edit User"
        }
      },
      {
        path: 'user-order-list/:id',
        component: UserOrderListComponent,canActivate: [AuthGuard],
        data: {
          title: "User Order List",
          breadcrumb: "User Order List"
        }
      },
      {
        path: 'return-list',
        component: ReturnListComponent, canActivate: [AuthGuard],
        data: {
          title: "Return List",
          breadcrumb: "Return List"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
