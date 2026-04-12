import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { VendorBannerService } from './../vendor-banner.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
selector: 'app-list-vendor-store',
templateUrl: './list-vendor-banner.component.html',
styleUrls: ['./list-vendor-banner.component.scss']
})
export class ListVendorBannerComponent implements OnInit {

  @ViewChild('bannerDelete', { static: true })
  bannerDelete!: TemplateRef<any>;

userrole:any;
isAdmin:boolean =false;
bannerLists=[];
banneravailable:boolean=false;
banner_id:any;
banner:any;
store_status_name:any;
vendorType:any;
currentUrl: string;
constructor( private router: Router, private vendorbannerservice: VendorBannerService, private route: ActivatedRoute, private dialog: MatDialog, private toaster: ToastrService) {

}


ngOnInit() {

this.userrole=localStorage.getItem("user_role");
if(this.userrole == 'admin'){
this.isAdmin=true;
}
this.allBannerList();
this.vendorType = localStorage.getItem('vendor_type');
// Navigation Routes...!!!
this.currentUrl = this.router.url;
localStorage.setItem('lastUrl', this.currentUrl);
}

allBannerList() {

/////  Admin All Banner   /////////

this.vendorbannerservice.allHomeBannerlist().subscribe(
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
    // console.log('List Of Home Banner API ==== ',res);
  },
  error => {
    this.toaster.error(error.error.message)
}
)



}

edit_banner(banner_id)
{
this.router.navigate(['/vendor-banner/edit-vendor-banner/'+banner_id]);
// console.log('Banner Edit', banner_id);
}

delete_banner(banner_id)
{
this.banner_id=banner_id;
this.dialog.open(this.bannerDelete,{ disableClose: false });
// console.log('Delleted Banner Id',this.banner_id)
}

deleteConfirm()
{
let dBanner=
{
  banner_id : this.banner_id
}
  this.vendorbannerservice.singleHomeBannerDelete(dBanner).subscribe(
    res =>
    {
      this.allBannerList();
      this.toaster.success('Banner deleted successfully')
      // console.log('Banner Deleted', res);
    },
    error => {
      this.toaster.error(error.error.message)
  }
  )
}


}
