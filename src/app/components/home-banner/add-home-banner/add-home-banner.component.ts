import { HomeBannerService } from './../home-banner.service';
import { ToastrService } from 'ngx-toastr';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import '@google/model-viewer';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TimingService } from 'src/app/timing.service';



@Component({
selector: 'app-add-home-banner',
templateUrl: './add-home-banner.component.html',
styleUrls: ['./add-home-banner.component.scss']
})



export class AddHomeBannerComponent implements OnInit {


  uploadBannerImages:any;
  userrole:any;
  isAdmin:boolean =false;
  bannerinsertValid: boolean = false;
  bannerinsertinValid: boolean= false;
  bannerinsertMessage:any
  public bannerSubmitForm: FormGroup;
  closeResult = '';
  storeLists=[];
  mainCatagoriesLists=[];
  allSubCatagoriesLists=[];

constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public homebannerservice: HomeBannerService, private router : Router , private toastrService: ToastrService,private ngZone: NgZone) { 
}

  

ngOnInit() {
this.userrole=localStorage.getItem("user_role");
if(this.userrole == 'admin'){
this.isAdmin=true;
}

// console.log(localStorage.getItem('user_token'));
this.bannerSubmitForm = new FormGroup({
  'banner_heading': new FormControl(null),
  'banner_sub_heading': new FormControl(null),
  'banner_heading_color': new FormControl(null),
  'banner_sub_heading_color': new FormControl(null),
  'banner_button_bg_color': new FormControl(null),
  'banner_button_text_color': new FormControl(null),
  'storeSlug': new FormControl(null),

});

this.homebannerservice.allStores().subscribe(
  res =>{
    this.storeLists=res['data'];
  },
  error => {
    this.toastrService.error(error.error.message)
}
)

this.homebannerservice.allCatagories().subscribe(
  res => {
    this.mainCatagoriesLists = res['data'];
    
    this.allSubCatagoriesLists = res['data'];
  },
  error => {
    this.toastrService.error(error.error.message)
  }
);

}



    // Create Room
    get banner_heading() { return this.bannerSubmitForm.get('store_nbanner_headingame').value; }
    get banner_sub_heading() { return this.bannerSubmitForm.get('banner_sub_heading').value; }
    get banner_heading_color() { return this.bannerSubmitForm.get('banner_heading_color').value; }
    get banner_sub_heading_color() { return this.bannerSubmitForm.get('banner_sub_heading_color').value; }
    get banner_button_bg_color() { return this.bannerSubmitForm.get('banner_button_bg_color').value; }
    get banner_button_text_color() { return this.bannerSubmitForm.get('banner_button_text_color').value; }
    get storeSlug() { return this.bannerSubmitForm.get('storeSlug').value; }


onBannerSubmit()
{
  let formData = this.bannerSubmitForm.value;

  if(this.bannerSubmitForm.invalid) {
  return;
  }
  let jsondata={};
  if(this.uploadBannerImages)
  {

  jsondata = 
  {
  "banner_title": formData.banner_heading,
  "banner_subtitle": formData.banner_sub_heading,
  "banner_store": formData.storeSlug,
  "banner_background_image": this.uploadBannerImages,
  "banner_title_color": formData.banner_heading_color,
  "banner_subtitle_color": formData.banner_sub_heading_color,
  "banner_button_bg_color": formData.banner_button_bg_color,
  "banner_button_text_color": formData.banner_button_text_color,
  }

    // console.log('Banner Submit Data =============',jsondata);

  this.homebannerservice.addHomeBanner(jsondata).subscribe(
  res => {

    // console.log('Banner Addes',res);  
    
    this.bannerinsertMessage="Banner Added successfully";
    this.bannerinsertValid = true;

    /// settimeout Start
    const startTime = performance.now();
    this.ngZone.runOutsideAngular(() => {
      const checkTime = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime >= 2000) {
          this.ngZone.run(() => {
            this.router.navigate(['/banner/list-home-banner']);
          });
        } else {
          requestAnimationFrame(checkTime);
        }
      };
      requestAnimationFrame(checkTime);
    });
    /// settimeout End
    
  },
  error => {
    this.toastrService.error(error.error.message)
}
);  
}
else
{
this.bannerinsertMessage="Image Upload Failed. Please Check Image Upload Guideline";
this.bannerinsertValid = false;
this.bannerinsertinValid= true;
}

  
}

public config: DropzoneConfigInterface = {
clickable: true,
maxFiles: 1,
autoReset: null,
errorReset: null,
cancelReset: null,

accept: (file, done) => {
  this.onAccept(file, done);
},

};


onAccept(ev: any, done: Function) {

  if (ev) {
    // console.log('Uplad File', ev)
        const file = ev;
        const img = new Image();
        img.onload = () => {
          // console.log('Current Width',img.width)
          // console.log('Current Height',img.height)
    
          //   // total: 2256862
    //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
    //   // {
      this.homebannerservice.uploadImage(file).subscribe(
        (res) => {
        // console.log('Image Upload Sucess',res);
        this.uploadBannerImages=res['data'].fileUrl;
        },
        error => {
          this.toastrService.error(error.error.message)
      }
        
        )
    //   // }
    
        };
        img.src = URL.createObjectURL(file);
        // console.log('Iamge Type', ev.type);
    
       
     }


}

public onUploadError(args: any): void { 
// console.log('onUploadError:', args);
}

public onUploadSuccess(args: any): void {
//  // console.log('onUploadSuccess:', args);
//  if(args[1].error == 0)
//  {
//   this.uploadBannerImages=args[1].data.fileUrl
//  }
//  else{
//   // localStorage.clear();
//   // this.router.navigate(['auth/vendor-login']);
//  }

}

open(content) {
this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
}, (reason) => {
  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
});
}

private getDismissReason(reason: any): string {
if (reason === ModalDismissReasons.ESC) {
  return 'by pressing ESC';
} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  return 'by clicking on a backdrop';
} else {
  return `with: ${reason}`;
}
}

}
