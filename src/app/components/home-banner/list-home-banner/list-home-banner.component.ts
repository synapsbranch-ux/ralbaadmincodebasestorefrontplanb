import { HomeBannerService } from './../home-banner.service';
import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
selector: 'app-list-store',
templateUrl: './list-home-banner.component.html',
styleUrls: ['./list-home-banner.component.scss']
})
export class ListHomeBannerComponent implements OnInit {

userrole:any;
isAdmin:boolean =false;
bannerLists=[];
banneravailable:boolean=false;

banner:any;
store_status_name:any;

constructor( private router: Router, private homebannerservice: HomeBannerService, private route: ActivatedRoute, private toastrService: ToastrService) {

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

if(this.userrole == 'admin')
{
this.homebannerservice.allHomeBannerlist().subscribe(
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
    this.toastrService.error(error.error.message)
}
)

}



} 

edit_banner(banner_id)
{
this.router.navigate(['/banner/edit-home-banner/'+banner_id]);
// console.log('Banner Edit', banner_id);
}

delete_banner(banner_id)
{
var result = confirm("Want to delete?");
if (result) {

// console.log('Banner Deleted', banner_id);


////////////////// Admin Delete Banner    /////////////////

if(this.userrole == 'admin')
{
this.banner=
{
  "banner_id": banner_id,
}
}

this.homebannerservice.singleHomeBannerDelete(this.banner).subscribe(
  res =>
  {
    this.allBannerList();
    // console.log('Banner Deleted', res);
  },
  error => {
    this.toastrService.error(error.error.message)
}
)
}

}



}
