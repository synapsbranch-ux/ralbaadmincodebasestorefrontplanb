import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { EditImageGuidlineComponent } from './edit-image-guideline/edit-image-guideline.component';
import { ListImageGuidelineComponent } from './list--image-guideline/list-image-guideline.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-imageguideline',
        component: ListImageGuidelineComponent,canActivate: [AuthGuard],
        data: {
          title: "List Image Guidline",
          breadcrumb: "List Image Guidline"
        }
      },    
      {
        path: 'edit-imageguideline/:id',
        component: EditImageGuidlineComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Image Guidline",
          breadcrumb: "Edit Image Guidline"
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageGuidlineRoutingModule { }
