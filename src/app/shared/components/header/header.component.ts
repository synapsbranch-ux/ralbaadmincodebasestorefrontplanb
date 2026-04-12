import { AdminService } from './../../../components/auth/_service/admin.service';
import { VendorService } from './../../../components/auth/_service/vendor.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavService } from '../../service/nav.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile : boolean;
  userToken:string ="";
  user_role:string
  profileimage:any;
  useradmin_role:any

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(public navServices: NavService, private router: Router, private vendorservice: VendorService, private adminservice: AdminService) { }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }


  ngOnInit() { 
    this.user_role = localStorage.getItem('user_role');
    this.useradmin_role = localStorage.getItem('useradmin_role');
  this.userToken=localStorage.getItem('user_token');
  console.log('User Login',this.userToken);


  if(this.user_role == 'admin' || this.useradmin_role == 'sub_admin')
  {
    this.profileimage=localStorage.getItem('profile_image');
  }
  if(this.user_role == 'vendor')
  {
    this.profileimage=localStorage.getItem('profile_image');
  }
  

  
   }

   logout()
   {

     console.log(localStorage.getItem('user_role'));
     if(this.user_role == 'admin'  || this.user_role == 'sub_admin')
     {
      this.router.navigate(['login']);
      localStorage.removeItem('useradmin_role');
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      localStorage.removeItem('currentUser');

     }

     if(this.user_role == 'vendor')
     {
      this.router.navigate(['vendor-login']);
      localStorage.removeItem('useradmin_role');
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      localStorage.removeItem('vendor_type');
      localStorage.removeItem('currentUser');

     }
   }

}
