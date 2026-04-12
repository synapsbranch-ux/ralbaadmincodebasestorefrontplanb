import { OnInit, Component,} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from '../_service/vendor.service';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-vendor-forgotpassword',
  templateUrl: './vendor-forgotpassword.component.html',
  styleUrls: ['./vendor-forgotpassword.component.scss']
})
export class VendorForgotComponent implements OnInit {
  active = 1;
  public forgotSubmitForm: FormGroup;
  btndesable:boolean=false;

  constructor(
    private router: Router,
    public vendorservice: VendorService,
    public route: ActivatedRoute,
    private tosaster: ToastrService,
    private timingService: TimingService
    ) {

      }

    ngOnInit() {
      this.forgotSubmitForm = new FormGroup({
        'register_email': new FormControl('', [Validators.required, Validators.email]),
      });
      
    }

    get register_email() { return this.forgotSubmitForm.get('register_email').value; }

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


  onForgotSubmit()
  {
    this.btndesable = true;
    let formData = this.forgotSubmitForm.value;
    let jsondata = 
    {
    "email": formData.register_email,
    }
    if(formData.register_email)
    {
      this.vendorservice.vendorforgotpassword(jsondata).subscribe(
        res => {
          this.btndesable = false;
          this.tosaster.success('Reset password has been sent to your registered email')
          this.timingService.runWithDelay(() => {
            this.router.navigate(['/vendor-login']); 
          }, 2000);  // 2000 milliseconds = 2 seconds
          
        },
        error => {
          // .... HANDLE ERROR HERE 
          this.tosaster.error(error.error.message) 
          this.timingService.runWithDelay(() => {
            this.forgotSubmitForm.reset() 
            this.btndesable = false;
          }, 2000);  // 2000 milliseconds = 2 seconds
      }
      ); 
    }
    else
    {
      this.tosaster.error('Email is required')
    }

  }


}
