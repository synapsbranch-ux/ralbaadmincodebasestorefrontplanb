import { ProductService } from './../../products/product.service';
import { Otp } from './../../../shared/data/otp';
import { PasswordStrengthValidator } from './../../../password-strength.validators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, take } from 'rxjs/operators';
import { VendorService } from '../_service/vendor.service'
import Validation from '../utils/validation';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';


@Component({
  selector: 'app-vendor-login',
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.scss']
})
export class VendorLoginComponent implements OnInit {
  active = 1;
  loginForm: FormGroup;
  registerForm: FormGroup;

  today: any;
  vendorOTPStatus: boolean = false;
  signupMassage: string = "";
  phValid: boolean = true;
  isValid: boolean = false;
  otpValid: boolean = true;
  loginMassage: any;
  loginValid: boolean = false;
  loginInValid: boolean = false;
  vendorRemindercheck: any = 'false';
  remembercheck: boolean = false;
  vendoremailrememberfield: any;
  vendorpasswordrememberfield: any;
  callForOtp = false;
  userOtp: any;
  getOtpVal: any;
  public otp: Otp[] = [];
  catagoriesLists = [];
  countDown: Subscription;
  counter = 196;
  tick = 1000;
  otpTimerstatus: boolean = false;
  selectcat = "1";
  selectCatagorries: any;
  othersstatus: boolean = false;
  temdesable: boolean = false;
  passworfieldtype = 'password';
  passwordicon = 'fa-eye fa-eye-slash';
  pstatus: boolean = false;
  returnUrl: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public vendorService: VendorService,
    private toaster: ToastrService,
    private productservice: ProductService,
    private route: ActivatedRoute
  ) {

  }

  owlcarousel = [
    {
      title: "e-Commerce-3D",
      desc: "Make your e-commerce site an artistic expression of who you are.",
    },
    {
      title: "e-Commerce-3D",
      desc: "Free yourself from cookie-cutter web technology to present a more authentic image to the world.",
    },
    {
      title: "e-Commerce-3D",
      desc: "The shopping experience you offer on-line begs to match real-life experiences.",
    }
  ]
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  ngOnInit() {

    this.vendorRemindercheck = localStorage.getItem('vendorRemindercheck');
    if (this.vendorRemindercheck == 'true') {
      this.remembercheck = true;
    }
    this.vendoremailrememberfield = localStorage.getItem('vendoremail');
    this.vendorpasswordrememberfield = localStorage.getItem('vendorpassword');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
    const currentUser = localStorage.getItem("user_id");
    if (currentUser) {
      this.router.navigate(['/dashboard']);
    }

    this.registerForm = new FormGroup({
      'vendor_name': new FormControl(null, [Validators.required]),
      'vendor_email': new FormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      'password': new FormControl(null, [Validators.minLength(8), Validators.maxLength(15), PasswordStrengthValidator]),
      'repeat_password': new FormControl(null, [Validators.required]),
      'vendor_phone': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(12)]),
      'catagories_name': new FormControl(null, [Validators.required]),
      'other_categories': new FormControl(null),
    },
      {
        validators: [Validation.match('password', 'repeat_password')]
      }
    );

    this.loginForm = new FormGroup({
      'vendor_username': new FormControl(null, [Validators.required]),
      'vendor_password': new FormControl(null, [Validators.required])
    });

    this.productservice.allCatagories().subscribe(
      res => {
        this.catagoriesLists = res['data'];
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )

  }

  getcatval(catname: any) {
    catname == 'others' ? this.othersstatus = true : this.othersstatus = false;
    this.selectCatagorries = catname;
  }

  // Vendor Registration form
  get vendor_name() { return this.registerForm.get('vendor_name').value; }
  get vendor_email() { return this.registerForm.get('vendor_email').value; }
  get password() { return this.registerForm.get('password').value; }
  get repeat_password() { return this.registerForm.get('repeat_password').value; }
  get vendor_phone() { return this.registerForm.get('vendor_phone').value; }
  get catagories_name() { return this.registerForm.get('catagories_name').value; }
  get other_categories() { return this.registerForm.get('othercategories').value; }

  // vendor Login Form
  get vendor_username() { return this.loginForm.get('vendor_username'); }
  get vendor_password() { return this.loginForm.get('vendor_password'); }

  get vReg() {
    return this.registerForm.controls;
  }

  get vLogin() {
    return this.loginForm.controls;
  }
  // Vendor Registration submit
  onVendorRegFormSubmit(): void {
    this.temdesable = true;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    let element = <HTMLInputElement>document.getElementById("customControlAutosizing1");
    if (element.checked) {
      let formData = this.registerForm.value;

      let data = {
        'name': formData.vendor_name,
        'email': formData.vendor_email,
        'phone': formData.vendor_phone,
        'type': 'VendorSignUp'
      }
      this.vendorService.vendorgenerateOTP(data).subscribe(
        res => {
          this.counter = 196;
          this.otpTimerstatus = true;
          this.otpTimer();
          this.getOtpVal = res['data'].otpValue;
          this.toaster.success('OTP has been sent to your registered e-mail address please check');
          this.vendorOTPStatus = true;
          this.temdesable = false;
        },
        error => {
          // .... HANDLE ERROR HERE 
          this.toaster.error(error.error.message);
          this.temdesable = false;

        }
      );
    }
    else {
      // this.phValid=false;
      // this.signupMassage="Please check Terms & Conditions";
      this.toaster.error('Please check Terms & Conditions');
    }

  }

  // Vendor login submit
  onVendorlogFormSubmit(): void {
    this.temdesable = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    let formData = this.loginForm.value;
    let data = {
      'email_phone': formData.vendor_username,
      'password': formData.vendor_password.trim(),
    }
    if (formData.vendor_username != null && formData.vendor_password != null) {



      this.vendorService.vendorLogin(data).subscribe(
        res => {
          if (res['data'].vendor_id != "") {
            const today = new Date();
            localStorage.setItem('user_id', res['data'].vendor_id);
            localStorage.setItem('user_token', res['data'].token);
            localStorage.setItem('profile_image', res['data'].profile_image);
            localStorage.setItem('user_role', 'vendor');
            localStorage.setItem('vendor_type', res['data'].vendor_type);
            localStorage.setItem('currentUser', JSON.stringify(res['data']));
            localStorage.setItem('store_date', today.toDateString());
            this.loginValid = true;
            this.loginInValid = false;

            //this.loginMassage='Login successfully';
            this.toaster.success('Login successfully');
            console.log('this.returnUrl', this.returnUrl)
            if (this.returnUrl) {
              // login successful so redirect to return url
              this.router.navigateByUrl(this.returnUrl, { skipLocationChange: false }).then(() => {
                this.temdesable = false;
                this.router.navigate([this.returnUrl]);
              });
            }
            else {
              this.router.navigateByUrl('dashboard', { skipLocationChange: false }).then(() => {
                this.temdesable = false;
                this.router.navigate(['dashboard']);

              });
            }
            // setTimeout(() => {
            //   this.router.navigate(['/dashboard'])
            //   .then(() => {
            //     window.location.reload();
            //   });
            // },2000) 
          }
        },
        error => {
          // .... HANDLE ERROR HERE 
          this.loginValid = false;
          this.loginInValid = true;
          this.temdesable = false;

          // this.loginMassage="Username and Password does not match";
          this.toaster.error(error.error.message);
        }
      );

    }
    else {
      this.loginValid = false;
      this.loginInValid = true;
      // this.loginMassage="Username and Password field is empty";
      this.toaster.error('Username and Password field is empty');
    }

  }
  rememberme(event: any) {
    this.remembercheck = !this.remembercheck;
    if (this.remembercheck == true) {
      localStorage.setItem('vendorRemindercheck', 'true');
      localStorage.setItem('vendoremail', (<HTMLInputElement>document.getElementById("vendoremail")).value);
      localStorage.setItem('vendorpassword', (<HTMLInputElement>document.getElementById("vendorpassword")).value);
    }

    if (this.remembercheck == false) {
      console.log('this.remembercheck Uncheck', this.remembercheck)
      this.vendorRemindercheck = 'false'
      localStorage.setItem('vendorRemindercheck', 'false');
      localStorage.removeItem('vendoremail')
      localStorage.removeItem('vendorpassword')
    }
  }

  otpTimer() {
    this.countDown = timer(0, this.tick)
      .pipe(take(this.counter))
      .subscribe(() => {
        if (this.counter > 0) {
          --this.counter;
        }
        else {
          this.countDown.unsubscribe();
        }
      });
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }

  otpverify() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (this.userOtp) {
      let formData = this.registerForm.value;
      let catname = "";
      if (this.selectCatagorries != 'others') {
        catname = formData.catagories_name
      }
      else {
        catname = formData.other_categories
      }
      let data = {
        'name': formData.vendor_name,
        'email': formData.vendor_email,
        'phone': formData.vendor_phone,
        'password': formData.password.trim(),
        'repeat_password': formData.repeat_password.trim(),
        'otp': this.userOtp,
        'catagories': catname,
      }
      this.vendorService.vendorSignUp(data).subscribe(
        res => {
          this.toaster.success('Your Registration successfully');
          setTimeout(() => {
            window.location.reload();
          }, 3000)
        },
        error => {
          // .... HANDLE ERROR HERE 
          this.toaster.error(error.error.message);
        }
      );


    } else {
      this.toaster.error('Please enter OTP first')
      // this.otpMassage="Please enter OTP first";
      this.otpValid = false;
    }
  }

  otpresend() {
    this.counter = 196;
    this.otpTimerstatus = true;
    this.otpTimer();
    let formData = this.registerForm.value;

    let data = {
      'name': formData.vendor_name,
      'email': formData.vendor_email,
      'phone': formData.vendor_phone,
      'type': 'VendorSignUp'
    }

    this.vendorService.vendorgenerateOTP(data).subscribe(
      res => {
        this.getOtpVal = res['data'].otpValue;
        this.toaster.success('OTP have been send to your register Email please Check');
        this.vendorOTPStatus = true;
      },
      error => {
        // .... HANDLE ERROR HERE 
        // this.phValid=false;
        // this.signupMassage="Phone number already exist";

        this.toaster.error(error.error.message);
      }
    );

  }

  onOtpChange(ele) {
    this.userOtp = ele;
  }

  fetchNews(tab: any) {
  }

  changeIcon() {
    this.pstatus = !this.pstatus

    if (this.pstatus) {
      this.passworfieldtype = 'text';
      this.passwordicon = 'fa-fw fa-eye';
    }
    else {
      this.passworfieldtype = 'password';
      this.passwordicon = 'fa-eye fa-eye-slash';
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
        this.onVendorRegFormSubmit();
      }
    }
  }

  handleEnter1(event: KeyboardEvent, nextElementId?: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (nextElementId) {
        const nextElement = document.getElementById(nextElementId);
        if (nextElement) {
          nextElement.focus();
        }
      } else {
        // If no next element id is provided, submit the form
        this.onVendorlogFormSubmit();
      }
    }
  }
}