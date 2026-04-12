import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BrandService } from '../brand.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CatagoriesService } from '../../catagories/catagories.service';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {
  brandinsertValid: boolean = false;
  brandinsertMessage: any

  brandname: any;
  brandslug: any;
  brandlocation: any;
  vendor_id: any;
  brand_descs: any;
  userrole: any;
  isAdmin: boolean = false;
  updatejson: any;
  public brandSubmitForm: FormGroup;
  closeResult = '';
  private fileToUpload: File = null;
  brand_image_name: any
  brand_image: any
  upload3DImage = [];
  brandProductJson: any;
  brand_json_file_name: any;
  invalidForm: boolean = false;
  brand_slug: any
  desableaddRooom: boolean = true;
  catagoriesList: any;
  categories: any
  selectedCategory = [];
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public brandservice: BrandService, private route: ActivatedRoute, private router: Router, private toster: ToastrService, private catagoriesservice: CatagoriesService,private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

    this.brandSubmitForm = new FormGroup({
      'brand_name': new FormControl(null, [Validators.required]),
      'selctedcategories': new FormControl(null, [Validators.required]),
    });
    this.allCatagoriesList();
    if (this.userrole == 'admin') {
      let brand_id =
      {
        "brand_id": this.route.snapshot.paramMap.get('id')
      }

      this.brandservice.singleBrandDetails(brand_id).subscribe(
        res => {
          this.brandname = res['data'].brand_name;
          this.categories = res['data'].categories;
          this.selectedCategory = this.categories.map(category => category['category_name']);
          this.brand_image = res['data'].brand_image;
          this.brand_json_file_name = res['data'].brand_json_file_name
          if (this.brand_image) {
            const url = this.brand_image
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1];
            const fullbrandname = lastPart.split('.');
            this.brandslug = fullbrandname[fullbrandname.length - 2];
            this.brand_image_name = res['data'].brand_image_name;
          }
          this.brand_slug = res['data'].brand_slug;
        },
        error => {
          this.toster.error(error.error.message)
        });
    }
  }

  allCatagoriesList() {

    /////  Admin All Category   /////////

    if (this.userrole == 'admin') {
      this.catagoriesservice.allCatagorieslist().subscribe(
        res => {
          this.catagoriesList = res['data'];
        
        },
        error => {
          this.toster.error(error.error.message)
        }
      )

    }
  }

  // Create Room
  get brand_name() { return this.brandSubmitForm.get('brand_name') }
  get selctedcategories() { return this.brandSubmitForm.get('selctedcategories') }

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

  onBrandEdit() {
    if (this.brandSubmitForm.invalid) {
      this.brandSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.brandSubmitForm.value;
    let filteredCategories = formData.selctedcategories.map((category) => ({
      _id: category._id,
      category_name: category.category_name,
    }));
    if (this.userrole == 'admin') {
      this.updatejson =
      {
        'brand_id': this.route.snapshot.paramMap.get('id'),
        "brand_name": formData.brand_name,
        "brand_image": this.brand_image,
        "brand_image_name": this.brand_image_name,
        "categories": filteredCategories
      }
      console.log('this.updatejson', this.updatejson)
      this.brandservice.singleBrandUpdate(this.updatejson).subscribe(
        res => {

          // console.log('Brand Updated',res);  
          this.brandinsertMessage = "Brand Updated successfully";
          this.brandinsertValid = true;
          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigate(['/brand/list-brand']);
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
          // .... HANDLE ERROR HERE 
          // console.log(error.message);
          this.toster.error(error.error.message)
        }
      );

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
      this.brand_image_name = file.name;
      const img = new Image();
      img.onload = () => {
        //   // total: 2256862
        // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
        // {
        this.brandservice.uploadImage(file).subscribe(
          (res) => {
            // console.log('Image Upload Sucess',res);
            this.brand_image = res['data'].fileUrl;
          },
          error => {
            this.toster.error(error.error.message)
          })

      };
      img.src = URL.createObjectURL(file);
    }
  }

  public onUploadError(args: any): void {
  }

  public onUploadSuccess(args: any): void {
  }

}
