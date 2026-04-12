import { OnInit, Component, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../_service/admin.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  active = 1;
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  loginMassage: string = "";
  loginValid: boolean = false;
  loginInValid: boolean = false;
  user_role: string = "ADMINISTRATOR";
  returnUrl: any;
  adminRemindercheck: any = 'false';
  remembercheck: boolean = false;
  adminemailrememberfield: any;
  adminpasswordrememberfield: any;

  passworfieldtype = 'password';
  passwordicon = 'fa-eye fa-eye-slash';
  pstatus: boolean = false;

  temdesable: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public adminService: AdminService,
    public route: ActivatedRoute,
    private tosaster: ToastrService
  ) {
    this.createLoginForm();
  }

  ngOnInit() {
    this.adminRemindercheck = localStorage.getItem('adminRemindercheck');
    if (this.adminRemindercheck == 'true') {
      this.remembercheck = true;
    }
    this.adminemailrememberfield = localStorage.getItem('adminemail');
    this.adminpasswordrememberfield = localStorage.getItem('adminpassword');

    const currentUser = localStorage.getItem("user_id");
    if (currentUser) {
      this.router.navigate(['dashboard']);
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
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



  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

  }

  get loginData() { return this.loginForm.controls; }

  onSubmitClick() {
    this.temdesable = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loginData.email.value != "" && this.loginData.password.value != "") {

      this.adminService.login(this.loginData.email.value, this.loginData.password.value.trim()).subscribe(
          data => {
            if (data['data'].admin_id != "") {
              this.loginForm.reset();
              localStorage.setItem('user_id', data['data'].admin_id);
              localStorage.setItem('user_role', 'admin');
              localStorage.setItem('useradmin_role', data['data']['role'].role_name);
              localStorage.setItem('profile_image', data['data'].profile_image);
              localStorage.setItem('user_token', data['data'].token);
              localStorage.setItem('currentUser', JSON.stringify(data['data']));
              this.loginValid = true;
              this.loginInValid = false;
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

            }
          },
          error => {
            console.log("error",error);
            // .... HANDLE ERROR HERE 
            this.loginValid = false;
            this.loginInValid = true;
            this.temdesable = false;
            // this.loginMassage="Username and Password does not match";
            this.tosaster.error(error.error.message);
          });
    }
    else {
      this.loginValid = false;
      this.loginInValid = true;
      // this.loginMassage="Username and Password field is empty";
      this.tosaster.error('Username and Password field is empty');

    }
  }

  rememberme(event: any) {
    this.remembercheck = !this.remembercheck;
    if (this.remembercheck == true) {
      console.log('this.remembercheck check', this.remembercheck)

      localStorage.setItem('adminRemindercheck', 'true');
      localStorage.setItem('adminemail', (<HTMLInputElement>document.getElementById("adminemail")).value);
      localStorage.setItem('adminpassword', (<HTMLInputElement>document.getElementById("adminpassword")).value);
    }

    if (this.remembercheck == false) {
      console.log('this.remembercheck Uncheck', this.remembercheck)
      this.adminRemindercheck = 'false'
      localStorage.setItem('adminRemindercheck', 'false');
      localStorage.removeItem('adminemail')
      localStorage.removeItem('adminpassword')
    }
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
          this.onSubmitClick();
      }
    }
  }

}
