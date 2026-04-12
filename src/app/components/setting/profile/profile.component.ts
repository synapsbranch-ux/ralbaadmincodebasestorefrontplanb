import { ToastrService } from 'ngx-toastr';
import { AdminService } from './../../auth/_service/admin.service';
import { VendorService } from './../../auth/_service/vendor.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user_name: string
  user_email: string
  user_phone: string
  userToken: string = "";
  user_role: string
  profileimage: any;
  active=1;
  constructor(private vendorservice: VendorService, private adminservice: AdminService, private toastrService: ToastrService) { }

  ngOnInit() {

    this.user_role = localStorage.getItem('user_role');
    this.userToken = localStorage.getItem('user_token');
    console.log('User Login', this.userToken);

    if (this.user_role == 'admin') {
      this.profileimage = "";
    }
    if (this.user_role == 'vendor') {
      this.vendorservice.vendorDetails().subscribe(
        res => {
          this.profileimage = res['data'][0].vendor_image;
          console.log('Vendor Details', res['data'][0].vendor_image);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }
    let userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
      this.user_name = userData.name;
      this.user_email = userData.email;
      this.user_phone = userData.phone;
    }
    console.log(userData);

  }

}
