import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../user.service';
import { PasswordStrengthValidator } from 'src/app/password-strength.validators';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  public userEditForm: FormGroup;
  signupMassage:string="";
  phValid: boolean = true;
  isValid: boolean = false;

  uName:any;
  uPhone:any;
  uEmail:any;
  user_id:any

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router : Router, private userservice: UsersService,private ngZone: NgZone) {

  }



  ngOnInit() {




    let udata=
    {
      "user_id": this.route.snapshot.paramMap.get('id')
    }
  
    this.userservice.singleUserDetails(udata).subscribe(
      res =>
      {
        // console.log('customer Details', res);
        this.uName=res['data'].name;
        this.uEmail=res['data'].email;
        this.uPhone=res['data'].phone;
        this.user_id=res['data']._id;
      }
    )
    this.userEditForm =  new FormGroup({
      'user_name': new FormControl(null, [Validators.required,Validators.pattern(/^(?! )[a-zA-Z ]*$/)]),
      'user_email': new FormControl(null, [Validators.required, Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      'user_password': new FormControl(null),
      'user_phone': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(15)]),

    })
  }

  get user_name() { return this.userEditForm.get('user_name'); }
  get user_email() { return this.userEditForm.get('user_email'); }
  get user_password() { return this.userEditForm.get('user_password');}
  get user_phone() { return this.userEditForm.get('user_phone');}


  onUserEditFormSubmit()
  {

    if (this.userEditForm.invalid) {
      this.userEditForm.markAllAsTouched();
      return;
    }
    let formData = this.userEditForm.value;
      
    let data = {
      "user_id": this.route.snapshot.paramMap.get('id'),
      'name': formData.user_name,
      'email': formData.user_email,
      'phone': formData.user_phone
    }

    // console.log(data);
    this.userservice.EditUser(data).subscribe(
      res => {
        // console.log('User Update Success',res);       

        this.isValid = true;
            this.signupMassage="User Updated Successfully";

          /// settimeout Start
            const startTime = performance.now();
            this.ngZone.runOutsideAngular(() => {
              const checkTime = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime >= 2000) {
                  this.ngZone.run(() => {
                    this.router.navigate(['/users/list-user']);
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
        this.phValid=false;
        this.signupMassage=error.error.message;
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
        this.onUserEditFormSubmit();
      }
    }
  }

}
