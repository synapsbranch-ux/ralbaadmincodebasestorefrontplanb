import { AdminService } from './../../components/auth/_service/admin.service';
import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { WINDOW } from "./windows.service";
// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
	hide?: boolean;
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = false



	constructor(@Inject(WINDOW) private window, private adminservice: AdminService) {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}


	}

	// Windows width
	@HostListener("window:resize", ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			path: '/dashboard', title: 'Dashboard', icon: 'home', type: 'link', hide: false, badgeType: 'primary', active: false
		},
		{
			title: 'Users', icon: 'user-plus', type: 'sub', hide: false, active: false, children: [
				{ path: '/users/list-user', title: 'User List', type: 'link' },
				{ path: '/users/create-user', title: 'Create User', type: 'link' },
				{ path: '/users/return-list', title: 'Return List', type: 'link' },
			]
		},
		{
			title: 'Categories', icon: 'user-plus', type: 'sub', hide: false, active: false, children: [
				{ path: '/categories/list-categories', title: 'Categories List', type: 'link' },
				{ path: '/categories/add-categories', title: 'Create Category', type: 'link' },
			]
		},
		{
			title: 'Brands', icon: 'box', type: 'sub', hide: false, active: false, children: [
				{ path: '/brand/list-brand', title: 'Brand List', type: 'link' },
				{ path: '/brand/add-brand', title: 'Add Brand', type: 'link' },
			]
		},
		{
			title: 'Tags', icon: 'box', type: 'sub', hide: false, active: false, children: [
				{ path: '/tag/list-tag', title: 'Tag List', type: 'link' },
				{ path: '/tag/add-tag', title: 'Add Tag', type: 'link' },
			]
		},
		{
			title: 'Media Text Content', icon: 'box', type: 'sub', hide: false, active: false, children: [
				{ path: '/media-text-content/list-media-text-content', title: 'Media Text Content List', type: 'link' },
				{ path: '/media-text-content/add-media-text-content', title: 'Add Media Text Content', type: 'link' },
			]
		},
		// {
		// 	title: 'Home Banner', icon: 'home', type: 'sub',hide: false,  active: false, children: [
		// 				{ path: '/banner/list-home-banner', title: 'List Home Banner', type: 'link' },
		// 				{ path: '/banner/add-home-banner', title: 'Add Home Banner', type: 'link' }
		// 	]
		// },
		{
			title: 'Vendors', icon: 'users', type: 'sub', hide: false, active: false, children: [
				{ path: '/vendors/list-vendors', title: 'Vendor List', type: 'link' },
				{ path: '/vendors/create-vendors', title: 'Create Vendor', type: 'link' },
			]
		},
		{
			title: 'Subadmin', icon: 'users', type: 'sub', hide: false, active: false, children: [
				{ path: '/subadmin/list-sub-admin', title: 'Subadmin List', type: 'link' },
				{ path: '/subadmin/add-sub-admin', title: 'Create Subadmin', type: 'link' },
			]
		},
		{
			title: 'Settings', icon: 'home', type: 'sub', hide: false, active: false, children: [
				{ path: '/settings/edit-settings', title: 'Edit Settings', type: 'link' },
				{ path: '/settings/edit-shipping-tax', title: 'Edit Shipping Tax', type: 'link' },
				{ path: '/settings/edit-commission', title: 'Edit Commission', type: 'link' },
				{ path: '/settings/admin-change-password', title: 'Change Password', type: 'link' },
				{ path: '/settings/edit-return-duration', title: 'Edit Return Duration', type: 'link' },
			]
		},
		{
			title: 'Coupons', icon: 'home', type: 'sub', hide: false, active: false, children: [
				{ path: '/coupons/list-coupons', title: 'List Coupons', type: 'link' },
				{ path: '/coupons/add-coupon', title: 'Add Coupon', type: 'link' },
			]
		},
		{
			title: 'Multi-Store Portal', icon: 'globe', type: 'sub', hide: false, active: false, children: [
				{ path: '/multistore-portal/pending-mtgs', title: 'Pending MTGs', type: 'link' },
				{ path: '/multistore-portal/pending-displayer-fulfiller', title: 'Pending Displayer/Fulfiller', type: 'link' },
			]
		},

	]

	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

	// Subadmin Menu-----------------------------

	MENUITEMS4: Menu[] = [
		{
			path: '/dashboard', title: 'Dashboard', icon: 'home', type: 'link', hide: false, badgeType: 'primary', active: false
		},
		{
			title: 'Users', icon: 'user-plus', type: 'sub', hide: false, active: false, children: [
				{ path: '/users/list-user', title: 'User List', type: 'link' },
				{ path: '/users/create-user', title: 'Create User', type: 'link' },
			]
		},
		{
			title: 'Categories', icon: 'user-plus', type: 'sub', hide: false, active: false, children: [
				{ path: '/categories/list-categories', title: 'Categories List', type: 'link' },
				{ path: '/categories/add-categories', title: 'Create Category', type: 'link' },
			]
		},
		{
			title: 'Vendors', icon: 'users', type: 'sub', hide: false, active: false, children: [
				{ path: '/vendors/list-vendors', title: 'Vendor List', type: 'link' },
				{ path: '/vendors/create-vendors', title: 'Create Vendor', type: 'link' },
			]
		},
		{
			title: 'Settings', icon: 'home', type: 'sub', hide: false, active: false, children: [
				{ path: '/settings/admin-change-password', title: 'Change Password', type: 'link' },
			]
		},
	]

	// Array
	items4 = new BehaviorSubject<Menu[]>(this.MENUITEMS4);


	// --------------------------------------------------- Vendor with No Store
	// ------------------------------------------------------

	MENUITEMS2: Menu[] = [
		{
			path: '/dashboard', title: 'Dashboard', icon: 'home', type: 'link', badgeType: 'primary', active: false
		},
		{
			title: 'Stores', icon: 'home', type: 'sub', active: false, children: [
				{ path: '/stores/list-store', title: 'List Store', type: 'link' },
				{ path: '/stores/add-store', title: 'Add Store', type: 'link' }

			]
		},
		{
			title: 'Category Addons', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/vendor-addons/list-addons-category', title: 'Category List', type: 'link' },
			]
		},
		{
			title: 'Products', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/products/product-list', title: 'Product List', type: 'link' },
				{ path: '/products/add-product', title: 'Add Product', type: 'link' },
			]
		},
		{
			title: 'Order Management', icon: 'home', type: 'sub', active: false, children: [
				{ path: '/order/order-list', title: 'Order List', type: 'link' },
				{ path: '/order/return-list', title: 'Return List', type: 'link' },
			]
		},
		{
			title: 'Settings', icon: 'home', type: 'sub', hide: false, active: false, children: [
				{ path: '/settings/vendor-change-password', title: 'Change Password', type: 'link' },
			]
		},
	]
	// Array
	items2 = new BehaviorSubject<Menu[]>(this.MENUITEMS2);

	// Vendor with Store

	MENUITEMS3: Menu[] = [
		{
			path: '/dashboard', title: 'Dashboard', icon: 'home', type: 'link', badgeType: 'primary', active: false
		},
		{
			title: 'Home Banner', icon: 'home', type: 'sub', active: false, children: [
				{ path: '/vendor-banner/list-vendor-banner', title: 'List Vendor Banner', type: 'link' },
				{ path: '/vendor-banner/add-vendor-banner', title: 'Add Vendor Banner', type: 'link' }
			]
		},
		{
			title: 'Stores', icon: 'home', type: 'sub', active: false, children: [
				{ path: '/stores/list-store', title: 'List Store', type: 'link' },

			]
		},
		{
			title: 'Addons Category', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/vendor-addons/list-addons-category', title: 'List Addons Category', type: 'link' },
			]
		},
		{
			title: 'Media Text Content', icon: 'box', type: 'sub', hide: false, active: false, children: [
				{ path: '/media-text-content/list-media-text-content', title: 'Media Text Content List', type: 'link' }
			]
		},
		{
			title: 'Products', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/products/product-list', title: 'Product List', type: 'link' },
				{ path: '/products/add-product', title: 'Add Product', type: 'link' },
			]
		},
		{
			title: 'Order Management', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/order/order-list', title: 'Order List', type: 'link' },
				{ path: '/order/return-list', title: 'Return List', type: 'link' },
			]
		},
		{
			title: 'Multi-Store Portal', icon: 'globe', type: 'sub', active: false, children: [
				{ path: '/multistore-portal/my-mtgs', title: 'My MTGs', type: 'link' },
				{ path: '/multistore-portal/platform-mtgs', title: 'Platform MTGs', type: 'link' },
				{ path: '/multistore-portal/platform-products', title: 'Platform Products', type: 'link' },
			]
		},
		{
			title: 'Settings', icon: 'home', type: 'sub', hide: false, active: false, children: [
				{ path: '/settings/edit-shipping-tax', title: 'Edit Shipping Tax', type: 'link' },
				{ path: '/settings/vendor-change-password', title: 'Change Password', type: 'link' },
			]
		},

	]
	// Array
	items3 = new BehaviorSubject<Menu[]>(this.MENUITEMS3);


	// Vendor with Store

	MENUITEMS5: Menu[] = [
		{
			path: '/dashboard', title: 'Dashboard', icon: 'home', type: 'link', badgeType: 'primary', active: false
		},
		{
			title: 'Home Banner', icon: 'home', type: 'sub', active: false, children: [
				{ path: '/vendor-banner/list-vendor-banner', title: 'List Vendor Banner', type: 'link' }
			]
		},
		{
			title: 'Stores', icon: 'home', type: 'sub', active: false, children: [
				{ path: '/stores/list-store', title: 'List Store', type: 'link' },

			]
		},
		{
			title: 'Addons Category', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/vendor-addons/list-addons-category', title: 'List Addons Category', type: 'link' },
			]
		},
		{
			title: 'Media Text Content', icon: 'box', type: 'sub', hide: false, active: false, children: [
				{ path: '/media-text-content/list-media-text-content', title: 'Media Text Content List', type: 'link' }
			]
		},
		{
			title: 'Products', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/products/product-list', title: 'Product List', type: 'link' },
			]
		},
		{
			title: 'Order Management', icon: 'box', type: 'sub', active: false, children: [
				{ path: '/order/order-list', title: 'Order List', type: 'link' },
				{ path: '/order/return-list', title: 'Return List', type: 'link' },
			]
		},
		{
			title: 'Multi-Store Portal', icon: 'globe', type: 'sub', active: false, children: [
				{ path: '/multistore-portal/my-mtgs', title: 'My MTGs', type: 'link' },
				{ path: '/multistore-portal/platform-mtgs', title: 'Platform MTGs', type: 'link' },
				{ path: '/multistore-portal/platform-products', title: 'Platform Products', type: 'link' },
			]
		},
		{
			title: 'Settings', icon: 'home', type: 'sub', hide: false, active: false, children: [
				{ path: '/settings/edit-shipping-tax', title: 'Edit Shipping Tax', type: 'link' },
				{ path: '/settings/vendor-change-password', title: 'Change Password', type: 'link' },
			]
		},

	]
	// Array
	items5 = new BehaviorSubject<Menu[]>(this.MENUITEMS5);

}
