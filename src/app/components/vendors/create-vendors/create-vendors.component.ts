import { VendorsService } from './../vendor.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { PasswordStrengthValidator } from 'src/app/password-strength.validators';

@Component({
  selector: 'app-create-vendors',
  templateUrl: './create-vendors.component.html',
  styleUrls: ['./create-vendors.component.scss']
})
export class CreateVendorsComponent implements OnInit {
  public accountForm: FormGroup;
  uploadVendorImages = "";
  signupMassage: string = "";
  phValid: boolean = true;
  isValid: boolean = false;

  constructor(private formBuilder: FormBuilder, private vendorsService: VendorsService, private router: Router) {
    this.createAccountForm();
  }

  createAccountForm() {
    this.accountForm = new FormGroup({
      'vendor_name': new FormControl(null, [Validators.required, Validators.pattern(/^(?! )[a-zA-Z ]*$/)]),
      'vendor_email': new FormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), PasswordStrengthValidator]),
      'vendor_phone': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(12)]),

    })
  }

  get vendor_name() { return this.accountForm.get('vendor_name'); }
  get vendor_email() { return this.accountForm.get('vendor_email'); }
  get password() { return this.accountForm.get('password'); }
  get vendor_phone() { return this.accountForm.get('vendor_phone'); }

  // Vendor Registration submit
  onVendorRegFormSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    let formData = this.accountForm.value;

    let data = {
      'name': formData.vendor_name,
      'email': formData.vendor_email,
      'password': formData.password.trim(),
      'repeat_password': formData.password.trim(),
      'vendor_image': this.uploadVendorImages,
      'phone': formData.vendor_phone
    }

    console.log(data);
    this.vendorsService.addVendor(data).subscribe(
      res => {
        // console.log('Vendor Signup Success',res);       

        this.isValid = true;
        this.signupMassage = "Vendor registration successful";
        this.accountForm.reset();
        setTimeout(() => {
          this.router.navigate(['/vendors/list-vendors']);
        }, 10)


      },
      error => {
        // .... HANDLE ERROR HERE 
        console.log(error.error.message);
        this.phValid = false;
        this.signupMassage = error.error.message
      }
    );
  }



  ngOnInit() { }


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
        this.vendorsService.uploadImage(file).subscribe(
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
        this.onVendorRegFormSubmit();
      }
    }
  }

}