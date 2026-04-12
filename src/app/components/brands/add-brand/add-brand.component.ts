import { ToastrService } from 'ngx-toastr';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../brand.service';
import '@google/model-viewer';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CatagoriesService } from '../../catagories/catagories.service';
import { TimingService } from 'src/app/timing.service';



@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})



export class AddBrandComponent implements OnInit {

  userrole: any;
  isAdmin: boolean = false;
  brandinsertValid: boolean = false;
  brandinsertinValid: boolean = false;
  brandinsertMessage: any
  uploadfrom: string = 'brand';
  public brandSubmitForm: FormGroup;
  closeResult = '';
  brand_image_name: any
  uploadBrandImages: any;
  brandProductJson: any;
  brandname: any
  brand_json_file_name: any;
  invalidForm: boolean = false;
  catagoriesList: any;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public brandservice: BrandService, private router: Router, private toastrService: ToastrService, private catagoriesservice: CatagoriesService,private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    // console.log(localStorage.getItem('user_token'));
    this.brandSubmitForm = new FormGroup({
      'brand_name': new FormControl(null, [Validators.required]),
      'selctedcategories': new FormControl(null, [Validators.required]),
    });
    this.allCatagoriesList();
  }


  allCatagoriesList() {

    /////  Admin All Category   /////////

    if (this.userrole == 'admin') {
      this.catagoriesservice.allCatagorieslist().subscribe(
        res => {
          this.catagoriesList = res['data'];
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )

    }
  }

  // Create Room
  get brand_name() { return this.brandSubmitForm.get('brand_name') }
  get selctedcategories() { return this.brandSubmitForm.get('selctedcategories') }

  onBrandSubmit() {

    if (this.brandSubmitForm.invalid) {
      this.brandSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.brandSubmitForm.value;

    if (this.brandSubmitForm.invalid) {
      return;
    }
    let jsondata = {};
    let brand_department = ""
    if (formData.brand_desc) {
      brand_department = formData.brand_desc;
    }
    else {
      brand_department = "";
    }

    let filteredCategories = formData.selctedcategories.map((category) => ({
      _id: category._id,
      category_name: category.category_name,
    }));
    jsondata =
    {
      "brand_name": formData.brand_name,
      "categories": filteredCategories,
      "brand_image": this.uploadBrandImages,
      "brand_image_name": this.brand_image_name,
    }
    console.log('Brand Submit Data =============', jsondata);

    this.brandservice.singleBrandAdd(jsondata).subscribe(
      res => {

        // console.log('Brand Addes',res);  

        this.brandinsertMessage = "Brand Added successfully";
        this.brandinsertValid = true;

          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['/brand/list-brand']);
                  });
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
        this.toastrService.error(error.error.message)
      }
    );
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
            this.uploadBrandImages = res['data'].fileUrl;
          },
          error => {
            this.toastrService.error(error.error.message)
          })

      };
      img.src = URL.createObjectURL(file);
    }
  }

  public onUploadError(args: any): void {
  }

  public onUploadSuccess(args: any): void {
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
