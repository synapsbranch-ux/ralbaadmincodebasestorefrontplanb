import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'stores',
    loadChildren: () => import('../../components/stores/store.module').then(m => m.StoreModule),
    data: {
      breadcrumb: "Stores"
    }
  },
  {
    path: 'brand',
    loadChildren: () => import('../../components/brands/brand.module').then(m => m.BrandModule),
    data: {
      breadcrumb: "Brands"
    }
  },
  {
    path: 'tag',
    loadChildren: () => import('../../components/tag-management/tag.module').then(m => m.TagModule),
    data: {
      breadcrumb: "Tags"
    }
  },
  {
    path: 'media-text-content',
    loadChildren: () => import('../../components/media-text-content/media-text-content.module').then(m => m.MediaTextContentModule),
    data: {
      breadcrumb: "Media Text Content"
    }
  },
  {
    path: 'departments',
    loadChildren: () => import('../../components/departments/department.module').then(m => m.DepartmentModule),
    data: {
      breadcrumb: "Department"
    }
  },
  {
    path: 'rooms',
    loadChildren: () => import('../../components/rooms/rooms.module').then(m => m.RoomsModule),
    data: {
      breadcrumb: "Rooms"
    }
  },
  {
    path: 'categories',
    loadChildren: () => import('../../components/catagories/catagories.module').then(m => m.CatagoriesModule),
    data: {
      breadcrumb: "Categories"
    }
  },
  {
    path: 'products',
    loadChildren: () => import('../../components/products/products.module').then(m => m.ProductsModule),
    data: {
      breadcrumb: "Products"
    }
  },
  {
    path: 'images',
    loadChildren: () => import('../../components/image-guideline/image-guideline.module').then(m => m.ImageGuidlineModule),
    data: {
      breadcrumb: "Image"
    }
  },
  {
    path: 'banner',
    loadChildren: () => import('../../components/home-banner/home-banner.module').then(m => m.HomeBannerModule),
    data: {
      breadcrumb: "Home Banner"
    }
  },
  {
    path: 'vendor-banner',
    loadChildren: () => import('../../components/vendor-banner/vendor-banner.module').then(m => m.VendorBannerModule),
    data: {
      breadcrumb: "Home Banner"
    }
  },
  {
    path: 'order',
    loadChildren: () => import('../../components/order-management/order.module').then(m => m.OrderModule),
    data: {
      breadcrumb: "Order Management"
    }
  },
  {
    path: 'sales',
    loadChildren: () => import('../../components/sales/sales.module').then(m => m.SalesModule),
    data: {
      breadcrumb: "Sales"
    }
  },
  {
    path: 'users',
    loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule),
    data: {
      breadcrumb: "Users"
    }
  },
  {
    path: 'vendors',
    loadChildren: () => import('../../components/vendors/vendors.module').then(m => m.VendorsModule),
    data: {
      breadcrumb: "Vendors"
    }
  },
  {
    path: 'subadmin',
    loadChildren: () => import('../../components/sub-admin/sub-admin.module').then(m => m.SubAdminModule),
    data: {
      breadcrumb: "Subadmin"
    }
  },
  {
    path: 'settings',
    loadChildren: () => import('../../components/setting/setting.module').then(m => m.SettingModule),
    data: {
      breadcrumb: "Settings"
    }
  },
  {
    path: 'vendor-addons',
    loadChildren: () => import('../../components/addons-category/addons-category.module').then(m => m.AddonsCategoryModule),
    data: {
      breadcrumb: "Addons Category"
    }
  },
  {
    path: 'coupons',
    loadChildren: () => import('../../components/coupons/coupons.module').then(m => m.CouponsModule),
    data: {
      breadcrumb: "Coupons"
    }
  },
  {
    path: 'multistore-portal',
    loadChildren: () => import('../../components/multistore-portal/multistore-portal.module').then(m => m.MultistorePortalModule),
    data: {
      breadcrumb: "Multi-Store Portal"
    }
  },
];