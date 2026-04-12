import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { ListMediaTextContentComponent } from './list-media-text-content/list-media-text-content.component';
import { AddMediaTextContentComponent } from './add-media-text-content/add-media-text-content.component';
import { EditMediaTextContentComponent } from './edit-media-text-content/edit-media-text-content.component';
import { venortypeauthGuard } from '../auth/_service/venortypeauth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-media-text-content',
        component: ListMediaTextContentComponent,canActivate: [AuthGuard],
        data: {
          title: "Media Text Content List",
          breadcrumb: "Media Text Content List"
        }
      },    
      {
        path: 'add-media-text-content',
        component: AddMediaTextContentComponent,canActivate: [AuthGuard,venortypeauthGuard],
        data: {
          title: "Add Media Text Content",
          breadcrumb: "Add Media Text Content"
        }
      }, 
      {
        path: 'edit-media-text-content/:id',
        component: EditMediaTextContentComponent,canActivate: [AuthGuard,venortypeauthGuard],
        data: {
          title: "Edit Media Text Content",
          breadcrumb: "Edit Media Text Content"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaTextContentRoutingModule { }
