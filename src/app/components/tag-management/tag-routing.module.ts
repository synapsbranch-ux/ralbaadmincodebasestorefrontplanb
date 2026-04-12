import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { ListTagComponent } from './list-tag/list-tag.component';
import { AddTagComponent } from './add-tag/add-tag.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-tag',
        component: ListTagComponent,canActivate: [AuthGuard],
        data: {
          title: "Tag List",
          breadcrumb: "Tag List"
        }
      },    
      {
        path: 'add-tag',
        component: AddTagComponent,canActivate: [AuthGuard],
        data: {
          title: "Add Tag",
          breadcrumb: "Add Tag"
        }
      }, 
      {
        path: 'edit-tag/:id',
        component: EditTagComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Tag",
          breadcrumb: "Edit Tag"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }
