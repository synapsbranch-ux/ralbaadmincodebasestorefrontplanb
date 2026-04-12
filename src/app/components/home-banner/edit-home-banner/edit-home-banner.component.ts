import { HomeBannerService } from './../home-banner.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-home-banner',
  templateUrl: './edit-home-banner.component.html',
  styleUrls: ['./edit-home-banner.component.scss']
})
export class EditHomeBannerComponent implements OnInit {
  uploadBannerImages: any;
  userrole: any;
  isAdmin: boolean = false;
  bannerinsertValid: boolean = false;
  bannerinsertinValid: boolean = false;
  bannerinsertMessage: any
  public bannerSubmitForm: FormGroup;
  closeResult = '';
  catagoriesLists = [];

  bannerHeading: any;
  bannerSubHeading: any;
  bannerbuttoncatagories: any
  bannerHeadingColor: any;
  bannerSubHeadingColor: any;
  bannerButtonBgColor: any;
  bannerButtonTextColor: any;
  storeLists = [];
  departmentLists = [];

  bannerstore: any;
  bannerdepartment: any;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public homebannerservice: HomeBannerService, private route: ActivatedRoute, private router: Router, private toastrService: ToastrService, private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

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
      res => {
        this.storeLists = res['data'];
      },
      error => {
        this.toastrService.error(error.error.message)
      }

    )

    if (this.userrole == 'admin') {
      let banner_id =
      {
        "banner_id": this.route.snapshot.paramMap.get('id')
      }

      this.homebannerservice.singleHomeBannerDetails(banner_id).subscribe(
        res => {
          this.bannerHeading = res['data'].banner_title;
          this.bannerbuttoncatagories = res['data'].banner_link;
          this.bannerSubHeading = res['data'].banner_subtitle;
          this.uploadBannerImages = res['data'].banner_background_image;
          this.bannerHeadingColor = res['data'].banner_title_color;
          this.bannerSubHeadingColor = res['data'].banner_subtitle_color;
          this.bannerButtonBgColor = res['data'].banner_button_bg_color;
          this.bannerButtonTextColor = res['data'].banner_button_text_color;
          this.bannerstore = res['data'].banner_store;
          this.bannerdepartment = res['data'].banner_department;
          // console.log('Single Baanner Details =====',res['data'])

        },
        error => {
          this.toastrService.error(error.error.message)
        }

      );
    }

  }


  // Create Banner
  get banner_heading() { return this.bannerSubmitForm.get('store_nbanner_headingame').value; }
  get banner_sub_heading() { return this.bannerSubmitForm.get('banner_sub_heading').value; }
  get catagories_name() { return this.bannerSubmitForm.get('catagories_name').value; }
  get banner_heading_color() { return this.bannerSubmitForm.get('banner_heading_color').value; }
  get banner_sub_heading_color() { return this.bannerSubmitForm.get('banner_sub_heading_color').value; }
  get banner_button_bg_color() { return this.bannerSubmitForm.get('banner_button_bg_color').value; }
  get banner_button_text_color() { return this.bannerSubmitForm.get('banner_button_text_color').value; }
  get storeSlug() { return this.bannerSubmitForm.get('storeSlug').value; }


  onBannerEdit() {
    let formData = this.bannerSubmitForm.value;
    // console.log(this.uploadBannerImages);

    if (this.userrole == 'admin') {
      if (this.uploadBannerImages != "") {
        let updatejson =
        {
          "banner_id": this.route.snapshot.paramMap.get('id'),
          "banner_title": formData.banner_heading,
          "banner_subtitle": formData.banner_sub_heading,
          "banner_background_image": this.uploadBannerImages,
          "banner_title_color": formData.banner_heading_color,
          "banner_subtitle_color": formData.banner_sub_heading_color,
          "banner_button_bg_color": formData.banner_button_bg_color,
          "banner_button_text_color": formData.banner_button_text_color,
          "banner_store": formData.storeSlug,
        }


        this.homebannerservice.singleHomeBannerUpdate(updatejson).subscribe(
          res => {

            // console.log('Banner Updated',res);  
            this.bannerinsertMessage = "Banner Updated successfully";
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
      else {
        this.bannerinsertMessage = "Image Upload Failed. Please Check Image Upload Guideline";
        this.bannerinsertValid = false;
        this.bannerinsertinValid = true;
      }

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
            this.uploadBannerImages = res['data'].fileUrl;
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
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
