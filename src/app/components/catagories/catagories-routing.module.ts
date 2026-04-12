import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { ListCatagoriesComponent } from './list-catagories/list-catagories.component';
import { AddCatagoriesComponent } from './add-catagories/add-catagories.component';
import { EditCatagoriesComponent } from './edit-catagories/edit-catagories.component';
import { ListSubCatagoriesComponent } from './list-sub-catagories/list-sub-catagories.component';
import { ListAttributeComponent } from './list-attribute/list-attribute.component';
import { ListAttributeVerientComponent } from './list-attribute-verient/list-attribute-verient.component';
import { ListAddonsVerientComponent } from './list-addons-verient/list-addons-verient.component';
import { ListAddonsComponent } from './list-addons/list-addons.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-categories',
        component: ListCatagoriesComponent,canActivate: [AuthGuard],
        data: {
          title: "Categories List",
          breadcrumb: "Categories List"
        }
      },    
      {
        path: 'add-categories',
        component: AddCatagoriesComponent,canActivate: [AuthGuard],
        data: {
          title: "Create Category",
          breadcrumb: "Create Category"
        }
      }, 
      {
        path: 'edit-categories/:id',
        component: EditCatagoriesComponent,canActivate: [AuthGuard],
        data: {
          title: "Edit Categories",
          breadcrumb: "Edit Categories"
        }
      },   
      {
        path: 'list-sub-categories/:catid',
        component: ListSubCatagoriesComponent,canActivate: [AuthGuard],
        data: {
          title: "List Sub Categories",
          breadcrumb: "List Sub Categories"
        }
      },      
      {
        path: 'list-attribute/:id',
        component: ListAttributeComponent,canActivate: [AuthGuard],
        data: {
          title: "List Attribute",
          breadcrumb: "List Attribute"
        }
      },
      {
        path: 'list-attribute-verient/:id',
        component: ListAttributeVerientComponent,canActivate: [AuthGuard],
        data: {
          title: "List Attribute Verient",
          breadcrumb: "List Attribute Verient"
        }
      }, 
      {
        path: 'list-addons/:id',
        component: ListAddonsComponent,canActivate: [AuthGuard],
        data: {
          title: "List Add Ons",
          breadcrumb: "List Add Ons"
        }
      },
      {
        path: 'list-addons-verient/:id',
        component: ListAddonsVerientComponent,canActivate: [AuthGuard],
        data: {
          title: "List Add Ons Verient",
          breadcrumb: "List Add Ons Verient"
        }
      }, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatagoriesRoutingModule { }
