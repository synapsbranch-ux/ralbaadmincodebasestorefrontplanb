
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import '@google/model-viewer';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { VendorBannerService } from '../vendor-banner.service';
import { TimingService } from 'src/app/timing.service';



@Component({
  selector: 'app-add-vendor-banner',
  templateUrl: './add-vendor-banner.component.html',
  styleUrls: ['./add-vendor-banner.component.scss']
})



export class AddVendorBannerComponent implements OnInit {


  uploadBannerImages: any;
  userrole: any;
  isAdmin: boolean = false;
  bannerinsertValid: boolean = false;
  bannerinsertinValid: boolean = false;
  bannerinsertMessage: any
  public bannerSubmitForm: FormGroup;
  closeResult = '';
  storeLists = [];
  departmentLists = [];
  banner_background_image_name: any;
  allSubCategoriesLists = [];
  mainCategory = [];
  selectedCategory: any
  selectedsubCategory: any
  brandList = [];

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public vendorbannerservice: VendorBannerService, private router: Router, private toastrService: ToastrService, private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
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
      'departmentSlug': new FormControl(null),
      'sub_catagories_name': new FormControl(null),
      'brand_List': new FormControl(null),
      'home_brand_List': new FormControl(null)

    });
    this.vendorbannerservice.allVendorBrands().subscribe(
      res => {
        this.brandList = res['data'];
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );

    this.vendorbannerservice.allsubCatagories().subscribe(
      res => {
        this.allSubCategoriesLists = res['data'];
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );

  }


  get banner_heading() { return this.bannerSubmitForm.get('store_nbanner_headingame').value; }
  get banner_sub_heading() { return this.bannerSubmitForm.get('banner_sub_heading').value; }
  get banner_heading_color() { return this.bannerSubmitForm.get('banner_heading_color').value; }
  get banner_sub_heading_color() { return this.bannerSubmitForm.get('banner_sub_heading_color').value; }
  get banner_button_bg_color() { return this.bannerSubmitForm.get('banner_button_bg_color').value; }
  get banner_button_text_color() { return this.bannerSubmitForm.get('banner_button_text_color').value; }
  get storeSlug() { return this.bannerSubmitForm.get('storeSlug').value; }
  get departmentSlug() { return this.bannerSubmitForm.get('departmentSlug').value; }
  get sub_catagories_name() { return this.bannerSubmitForm.get('sub_catagories_name').value; }
  get brand_List() { return this.bannerSubmitForm.get('brand_List').value; }
  get home_brand_List() { return this.bannerSubmitForm.get('home_brand_List').value; }

  onBannerSubmit() {
    let formData = this.bannerSubmitForm.value;
    if (this.bannerSubmitForm.invalid) {
      return;
    }
    let jsondata = {};
    if (this.uploadBannerImages) {

      jsondata =
      {
        "banner_title": formData.banner_heading,
        "banner_subtitle": formData.banner_sub_heading,
        "banner_background_image": this.uploadBannerImages,
        "banner_background_image_name": this.banner_background_image_name,
        "banner_title_color": formData.banner_heading_color ??= '#000000',
        "banner_subtitle_color": formData.banner_sub_heading_color ??= '#000000',
        "banner_button_bg_color": formData.banner_button_bg_color ??= '#000000',
        "banner_button_text_color": formData.banner_button_text_color ??= '#000000',
        "banner_sub_categories": formData.sub_catagories_name,
        "banner_top_brands": formData.brand_List,
        "banner_homepage_brands": formData.home_brand_List
      }

      this.vendorbannerservice.addHomeBanner(jsondata).subscribe(
        res => {

          // console.log('Banner Addes',res);  

          this.bannerinsertMessage = "Banner Added successfully";
          this.bannerinsertValid = true;
          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigate(['/vendor-banner/list-vendor-banner']);
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

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,

  };

  public onUploadError(args: any): void {
    console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    // if(args[0].width == 400 && args[0].height == 400 && args[0].upload.total <= 5000000)
    // {
    this.banner_background_image_name = args[0].name;
    let image_link = args[1].data.fileUrl
    // let image_name = args[1].data.image_name.replace('vendor/','');
    console.log('args[0] ===============', args[0].name);
    this.uploadBannerImages = image_link;
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


  handleEnter(event: KeyboardEvent, nextElementId?: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (nextElementId) {
        const nextElement = document.getElementById(nextElementId);
        if (nextElement) {
          nextElement.focus();
        }
      } else {
        // If no next element id is provided, submit the form
        this.onBannerSubmit();
      }
    }
  }



  onFileAdded(file: File) {
    // console.log('File added manually:', file);

    this.vendorbannerservice.uploadImage(file).subscribe({
      next: (res) => {
        this.onUploadSuccess([file, res]); 
      },
      error: (err) => {
        console.error('Manual upload error', err);
      }
    });
  }


}
