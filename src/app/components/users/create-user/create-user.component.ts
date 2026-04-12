import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../user.service';
import { PasswordStrengthValidator } from 'src/app/password-strength.validators';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public useraddForm: FormGroup;
  signupMessage: string = "";
  phValid: boolean = true;
  isValid: boolean = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private userservice: UsersService, private ngZone: NgZone) {
    this.createAccountForm();
  }

  createAccountForm() {
    this.useraddForm = new FormGroup({
      'user_name': new FormControl(null, [Validators.required, Validators.pattern(/^(?! )[a-zA-Z ]*$/)]),
      'user_email': new FormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      'user_password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), PasswordStrengthValidator]),
      'user_phone': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(15)]),

    })
  }

  get user_name() { return this.useraddForm.get('user_name'); }
  get user_email() { return this.useraddForm.get('user_email'); }
  get user_password() { return this.useraddForm.get('user_password'); }
  get user_phone() { return this.useraddForm.get('user_phone'); }


  ngOnInit() {


  }

  // Vendor Registration submit
  onUserRegFormSubmit(): void {
    if (this.useraddForm.invalid) {
      this.useraddForm.markAllAsTouched();
      return;
    }
    let formData = this.useraddForm.value;

    let data = {
      'name': formData.user_name,
      'email': formData.user_email,
      'password': formData.user_password.trim(),
      'phone': formData.user_phone
    }

    // console.log(data);
    this.userservice.addUser(data).subscribe(
      res => {
        // console.log('User Signup Success',res);       

        this.isValid = true;
        this.signupMessage = "User Registration successfully";
        this.useraddForm.reset();

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
        this.phValid = false;
        this.signupMessage = error.error.message;
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
        this.onUserRegFormSubmit();
      }
    }
  }

}
