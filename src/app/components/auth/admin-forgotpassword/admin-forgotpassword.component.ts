import { OnInit, Component, NgZone, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../_service/admin.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-admin-forgotpassword',
  templateUrl: './admin-forgotpassword.component.html',
  styleUrls: ['./admin-forgotpassword.component.scss']
})
export class AdminForgotComponent implements OnInit {
  active = 1;
  public forgotSubmitForm: FormGroup;
  btndesable: boolean = false;
  constructor(
    private router: Router,
    public adminService: AdminService,
    public route: ActivatedRoute,
    private tosaster: ToastrService,
    private ngZone: NgZone
  ) {

  }

  ngOnInit() {
    this.forgotSubmitForm = new FormGroup({
      'register_email': new FormControl('', [Validators.required, Validators.email]),
    });

  }

  get register_email() { return this.forgotSubmitForm.get('register_email').value; }
  get loginData() { return this.forgotSubmitForm.controls; }


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


  onForgotSubmit() {
    this.btndesable = true;
    if (this.forgotSubmitForm.invalid) {
      this.forgotSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.forgotSubmitForm.value;
    let jsondata =
    {
      "email": formData.register_email,
    }
    if (formData.register_email) {
      this.adminService.adminforgotpassword(jsondata).subscribe(
        res => {
          this.btndesable = false;
          this.tosaster.success('Reset password has been sent to your registered email')

          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigate(['/login']);
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
          this.tosaster.error(error.error.message)
          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.forgotSubmitForm.reset()
                  this.btndesable = false;
                });
              } else {
                requestAnimationFrame(checkTime);
              }
            };
            requestAnimationFrame(checkTime);
          });
          /// settimeout End
        }
      );

    }
    else {
      this.tosaster.error('Email is required')
    }
  }
}
