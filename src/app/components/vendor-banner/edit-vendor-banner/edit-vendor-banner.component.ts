import { VendorBannerService } from './../vendor-banner.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-vendor-banner',
  templateUrl: './edit-vendor-banner.component.html',
  styleUrls: ['./edit-vendor-banner.component.scss']
})
export class EditVendorBannerComponent implements OnInit {
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
  banner_background_image_name: any;
  bannerstore: any;
  bannerdepartment: any;
  allSubCategoriesLists = []
  selectedCategory: any
  selectedsubCategory = [];
  selectedBrands = [];
  selectedHomeBrands = [];
  brandList = [];
  subCategoriesLists: any;
  top_brands: any;
  home_brands: any;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public vendorbannerservice: VendorBannerService, private route: ActivatedRoute, private router: Router, private toastrService: ToastrService, private ngZone: NgZone) {
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
      'sub_catagories_name': new FormControl(null),
      'brand_List': new FormControl(null),
      'home_brand_List': new FormControl(null)
    });
    this.vendorbannerservice.allsubCatagories().subscribe(
      res => {
        this.allSubCategoriesLists = res['data'];
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );

    this.vendorbannerservice.allVendorBrands().subscribe(
      res => {
        this.brandList = res['data'];
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );

    let banner_id =
    {
      "banner_id": this.route.snapshot.paramMap.get('id')
    }

    this.vendorbannerservice.singleHomeBannerDetails(banner_id).subscribe(
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
        this.banner_background_image_name = res['data'].banner_background_image_name;
        this.subCategoriesLists = res['data'].banner_sub_categories;
        this.top_brands = res['data'].banner_top_brands;
        this.home_brands = res['data'].banner_homepage_brands;
        // Extract category names from subCategoriesLists
        this.selectedsubCategory = this.subCategoriesLists.map(iterator => iterator.category_name);
        console.log('this.selectedsubCategory', this.selectedsubCategory);

        // Extract brand names from top_brands
        this.selectedBrands = this.top_brands.map(iterator => iterator.brand_name);
        console.log('this.selectedBrands', this.selectedBrands);


        // Extract brand names from home_brands
        this.selectedHomeBrands = this.home_brands.map(iterator => iterator.brand_name);
        console.log('this.selectedHomeBrands', this.selectedHomeBrands);
      },

      error => {
        this.toastrService.error(error.error.message)
      }
    );

  }


  ensureArray(input) {
    if (Array.isArray(input)) {
      return input; // If input is already an array, return it as is
    } else if (typeof input === 'object') {
      return Object.values(input); // If input is an object, convert it to an array of its values
    } else {
      return [input]; // If input is neither an array nor an object, wrap it in an array
    }
  }

  // Create Banner
  get banner_heading() { return this.bannerSubmitForm.get('store_nbanner_headingame').value; }
  get banner_sub_heading() { return this.bannerSubmitForm.get('banner_sub_heading').value; }
  get banner_heading_color() { return this.bannerSubmitForm.get('banner_heading_color').value; }
  get banner_sub_heading_color() { return this.bannerSubmitForm.get('banner_sub_heading_color').value; }
  get banner_button_bg_color() { return this.bannerSubmitForm.get('banner_button_bg_color').value; }
  get banner_button_text_color() { return this.bannerSubmitForm.get('banner_button_text_color').value; }
  get sub_catagories_name() { return this.bannerSubmitForm.get('sub_catagories_name').value; }
  get brand_List() { return this.bannerSubmitForm.get('brand_List').value; }
  get home_brand_List() { return this.bannerSubmitForm.get('home_brand_List').value; }

  onBannerEdit() {
    let formData = this.bannerSubmitForm.value;
    // console.log(this.uploadBannerImages);
    if (this.uploadBannerImages != "") {
      console.log("this.selectedsubCategory[0].hasOwnProperty('_id')", this.selectedsubCategory[0].hasOwnProperty('_id'))
      console.log('selectedsubCategory----', this.selectedsubCategory)
      console.log('formData.brand_List', formData.brand_List, this.selectedBrands)
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
        "banner_sub_categories": (this.selectedsubCategory[0].hasOwnProperty('category_id')) ? this.selectedsubCategory : this.subCategoriesLists,
        "banner_top_brands": (this.selectedBrands[0].hasOwnProperty('_id')) ? this.selectedBrands : this.top_brands,
        "banner_homepage_brands": (this.selectedHomeBrands[0].hasOwnProperty('_id')) ? this.selectedHomeBrands : this.home_brands
      }

      console.log('updatejson---', updatejson);
      this.vendorbannerservice.singleHomeBannerUpdate(updatejson).subscribe(
        res => {

          // console.log('Banner Updated',res);  
          this.bannerinsertMessage = "Banner updated successfully";
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

  onSelectionChange(fieldName: string, event: any) {
    // Update form control with the latest selection
    this.bannerSubmitForm.get(fieldName)?.setValue(event);
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
        this.onBannerEdit();
      }
    }
  }


  public onUploadError(args: any): void {
    // console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    // if(args[0].width == 400 && args[0].height == 400 && args[0].upload.total <= 5000000)
    // {
    console.log('Old iamge', this.uploadBannerImages);
    this.banner_background_image_name = args[0].name;
    let image_link = args[1].data.fileUrl
    // let image_name = args[1].data.image_name.replace('banner/','');
    this.uploadBannerImages = image_link;
    console.log('Upload new iamge', this.uploadBannerImages);
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


  onFileAdded(file: File) {
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
