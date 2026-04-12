import { AdminService } from './../../auth/_service/admin.service';
import { PasswordStrengthValidator } from 'src/app/password-strength.validators';
import { OnInit, Component, ElementRef, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, first, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import Validation from '../../auth/utils/validation';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-admin-changepassword',
  templateUrl: './admin-changepassword.component.html',
  styleUrls: ['./admin-changepassword.component.scss']
})
export class AdminChangeComponent implements OnInit {

  public changeSubmitForm: FormGroup;
  changePasswordFormStatus: boolean = true;
  @ViewChild('userPassword', {static: true}) userPassword: ElementRef;

  constructor(
    private router: Router,
    public adminService: AdminService,
    public route: ActivatedRoute,
    private tosaster: ToastrService
  ) {

  }

  ngOnInit() {
    this.changeSubmitForm = new FormGroup({
      'oldPassword': new FormControl(null, [Validators.required]),
      'newPassword': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), PasswordStrengthValidator]),
      'confirmPassword': new FormControl(null, [Validators.required]),
    },
      {
        validators: [Validation.match('newPassword', 'confirmPassword')]
      }

    );

    this.debounce(this.userPassword.nativeElement, 'keyup').subscribe(val => {
      this.samepasswordcheck(val);
      // console.log(`Debounced Input: ${val}`);
    });

  }

  get oldPassword() { return this.changeSubmitForm.get('oldPassword'); }
  get newPassword() { return this.changeSubmitForm.get('newPassword'); }
  get confirmPassword() { return this.changeSubmitForm.get('confirmPassword'); }

  onChangePasswordSubmit() {
    if (this.changeSubmitForm.invalid) {
      this.changeSubmitForm.markAllAsTouched();
      return;
    }
    let formData = this.changeSubmitForm.value;
    let EdData = {
      "old_Password": formData.oldPassword,
      "new_Password": formData.newPassword,
      "confirm_Password": formData.confirmPassword
    }

    if (this.changePasswordFormStatus) {
      this.adminService.changePassword(EdData).subscribe(
        res => {
          this.tosaster.success('Password Change Successfully')
          this.changeSubmitForm.reset();
        },
        error => {
          this.tosaster.error(error.error.message);
        });
    }
    else
    {
      this.tosaster.error('Please use different password . This password is already being used earlier.');
    }
  }

  samepasswordcheck(data: any) {
    let passwordObj =
    {
      current_Password: data
    }

    this.adminService.samepasswordcheck(passwordObj).subscribe(
      res => {
        this.changePasswordFormStatus = true;
      },
      error => {
        this.changePasswordFormStatus = false;
        this.tosaster.error(error.error.message)
      }
    )

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
        this.onChangePasswordSubmit();
      }
    }
  }

  debounce(element, event, time = 800){
    const eventObserver = fromEvent(this.userPassword.nativeElement, 'keyup')
                          .pipe(map((i:any) => i.currentTarget.value));
    return eventObserver.pipe(debounceTime(800));
  }

}