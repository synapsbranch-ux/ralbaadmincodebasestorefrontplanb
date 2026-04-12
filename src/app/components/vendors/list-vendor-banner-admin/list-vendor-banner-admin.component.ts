import { ToastrService } from 'ngx-toastr';

import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorsService } from '../vendor.service';


@Component({
selector: 'app-list-vendor-admin',
templateUrl: './list-vendor-banner-admin.component.html',
styleUrls: ['./list-vendor-banner-admin.component.scss']
})
export class ListVendorBannerAdminComponent implements OnInit {

userrole:any;
isAdmin:boolean =false;
bannerLists=[];
banneravailable:boolean=false;
banner:any;
store_status_name:any;

constructor( private router: Router, private vendorbannerservice: VendorsService, private route: ActivatedRoute, private toaster: ToastrService) {

}


ngOnInit() {

this.userrole=localStorage.getItem("user_role");
if(this.userrole == 'admin'){
this.isAdmin=true;
}
this.allBannerList();

}

allBannerList() {

/////  Admin All Banner   /////////
let vBData=
{
  vendor_id : this.route.snapshot.paramMap.get('id')
}

this.vendorbannerservice.allHomeBannerlist(vBData).subscribe(
  res =>{
    this.bannerLists=res['data'];
    if(this.bannerLists.length > 0)
    {
      this.banneravailable=true;
    }
    else
    {
      this.banneravailable=false;
    }
    // console.log('List Of Home Banner API ==== ',this.bannerLists,this.banneravailable);
  },
  error => {
    this.toaster.error(error.error.message)
}
)
} 

bannerStatusChange(banner_id:any,bannerstatus:any)
{

  let banner_ststus='';

  if(bannerstatus == 'active')
  {
    banner_ststus='pending'
  }
  else
  {
    banner_ststus='active'
  }

  let vBSData=
{
  banner_id : banner_id,
  status: banner_ststus
}

this.vendorbannerservice.vendorBannerStatusChange(vBSData).subscribe(
  res =>{
  this.toaster.success('Banner status change successfully')
  this.allBannerList();
    // console.log('Admin banner ststus change',res)
  },
  error => {
    this.toaster.error(error.error.message)
}
)
}


}
