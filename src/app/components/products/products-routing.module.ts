import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_service/auth-guard.service';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';
import { EditProductComponent } from './edit-product/editproduct.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductListComponent } from './products-list/product-list.component';
import { PendingProductListComponent } from './pending-products-list/pending-products-list.component';
import { ApproveProductListComponent } from './approve-products-list/approve-products-list.component';


const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'product-category',
        component: ProductCategoryComponent, canActivate: [AuthGuard],
        data: {
          title: "Category",
          breadcrumb: "Category"
        }
      },
      {
        path: 'edit-category/:id', canActivate: [AuthGuard],
        component: EditCategoriesComponent,
        data: {
          title: "Edit Category",
          breadcrumb: "Edit Category"
        }
      },
      {
        path: 'product-list',
        component: ProductListComponent, canActivate: [AuthGuard],
        data: {
          title: "Product List",
          breadcrumb: "Product List"
        }
      },
      {
        path: 'pending-product-list',
        component: PendingProductListComponent, canActivate: [AuthGuard],
        data: {
          title: "Pending Product List",
          breadcrumb: "Pending Product List"
        }
      },
      {
        path: 'approve-product-list',
        component: ApproveProductListComponent, canActivate: [AuthGuard],
        data: {
          title: "Approve Product List",
          breadcrumb: "Approve Product List"
        }
      },
      {
        path: 'add-product',
        component: ProductAddComponent, canActivate: [AuthGuard],
        data: {
          title: "Add Products",
          breadcrumb: "Add Product"
        }
      },
      {
        path: 'edit-product/:id',
        component: EditProductComponent, canActivate: [AuthGuard],
        data: {
          title: "Edit Products",
          breadcrumb: "Edit Product"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
