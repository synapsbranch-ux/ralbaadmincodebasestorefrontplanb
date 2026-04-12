import { VendorsService } from './../vendor.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {

  public accountForm: FormGroup;
  uploadVendorImages: any;
  signupMassage: string = "";
  phValid: boolean = true;
  isValid: boolean = false;

  vName: any;
  vPhone: any;
  vEmail: any;
  vendor_id: any

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private vendorService: VendorsService, private toastrService: ToastrService, private ngZone: NgZone) {
    this.createAccountForm();
  }

  createAccountForm() {
    this.accountForm = new FormGroup({
      'vendor_name': new FormControl(null, [Validators.required, Validators.pattern(/^(?! )[a-zA-Z ]*$/)]),
      'vendor_email': new FormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      'vendor_phone': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(15)]),

    })
  }

  get vendor_name() { return this.accountForm.get('vendor_name'); }
  get vendor_email() { return this.accountForm.get('vendor_email'); }
  get vendor_phone() { return this.accountForm.get('vendor_phone'); }

  ngOnInit() {
    let vdata =
    {
      "vendor_id": this.route.snapshot.paramMap.get('id')
    }

    this.vendorService.singleVendorDetails(vdata).subscribe(
      res => {
        // console.log('customer Details', res);
        this.vName = res['data'].name;
        this.vEmail = res['data'].email;
        this.vPhone = res['data'].phone;
        this.vendor_id = res['data']._id;
        this.uploadVendorImages = res['data'].vendor_image;
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    )

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
        this.vendorService.uploadImage(file).subscribe(
          (res) => {
            // console.log('Image Upload Sucess',res);
            this.uploadVendorImages = res['data'].fileUrl;
          },
          (err) => {
            // console.log('Image Upload Error',err);
          })
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
    // // console.log('onUploadSuccess:', args);
    // if (args[1].error == 0) {
    //   this.uploadVendorImages = args[1].data.fileUrl
    // }
    // else {
    //   // localStorage.clear();
    //   // this.router.navigate(['auth/vendor-login']);
    // }

  }

  // Vendor Registration submit
  onVendorEditFormSubmit(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    let formData = this.accountForm.value;

    let data = {
      'vendor_id': this.vendor_id,
      'name': formData.vendor_name,
      'email': formData.vendor_email,
      'phone': formData.vendor_phone,
      'vendor_image': this.uploadVendorImages
    }
    // console.log(data);
    this.vendorService.singleVendorUpdate(data).subscribe(
      res => {
        // console.log('Vendor Update Success',res);       

        this.isValid = true;
        this.signupMassage = "Vendor Updated successfully";

        /// settimeout Start
        const startTime = performance.now();
        this.ngZone.runOutsideAngular(() => {
          const checkTime = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= 2000) {
              this.ngZone.run(() => {
                this.router.navigate(['/vendors/list-vendors']);
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
        this.onVendorEditFormSubmit();
      }
    }
  }

}
