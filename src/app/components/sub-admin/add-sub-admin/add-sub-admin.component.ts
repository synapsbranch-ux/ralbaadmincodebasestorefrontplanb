import { SubAdminService } from './../sub-admin.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Validation from '../../auth/utils/validation';
import { PasswordStrengthValidator } from 'src/app/password-strength.validators';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-add-sub-admin',
  templateUrl: './add-sub-admin.component.html',
  styleUrls: ['./add-sub-admin.component.scss']
})
export class AddSubAdminComponent implements OnInit {
  subadmininsertValid: boolean = false;
  subadmininsertMessage: any
  subadmininsertimgValid: boolean = false;
  public subadminSubmitForm: FormGroup;
  closeResult = '';

  constructor(private formBuilder: FormBuilder, public subadminservice: SubAdminService, private router: Router, private toaster: ToastrService, private ngZone: NgZone) {
  }



  ngOnInit() {

    this.subadminSubmitForm = new FormGroup({
      'subadmin_name': new FormControl(null, [Validators.required, Validators.pattern(/^(?! )[a-zA-Z ]*$/)]),
      'subadmin_email': new FormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      'subadmin_password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), PasswordStrengthValidator]),
      'subadmin_repeat_password': new FormControl(null, [Validators.required]),
    },
      {
        validators: [Validation.match('subadmin_password', 'subadmin_repeat_password')]
      });

  }

  // Create Room
  get subadmin_name() { return this.subadminSubmitForm.get('subadmin_name'); }
  get subadmin_email() { return this.subadminSubmitForm.get('subadmin_email'); }
  get subadmin_password() { return this.subadminSubmitForm.get('subadmin_password'); }
  get subadmin_repeat_password() { return this.subadminSubmitForm.get('subadmin_repeat_password'); }

  onSubadminSubmit() {
    if (this.subadminSubmitForm.invalid) {
      this.subadminSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.subadminSubmitForm.value;

    if (this.subadminSubmitForm.invalid) {
      return;
    }

    let jsondata =
    {
      "role_id": "615acddcb4bdb72bad6b63a6",
      "name": formData.subadmin_name,
      "email": formData.subadmin_email,
      "password": formData.subadmin_password.trim()

    }

    this.subadminservice.addSubadmin(jsondata).subscribe(
      res => {

        // console.log('Subadmin Added',res);  

        this.subadmininsertMessage = "Subadmin Added successfully";
        this.subadmininsertValid = true;
        /// settimeout Start
        const startTime = performance.now();
        this.ngZone.runOutsideAngular(() => {
          const checkTime = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= 2000) {
              this.ngZone.run(() => {
                this.router.navigate(['/subadmin/list-sub-admin']);
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
        this.toaster.error(error.error.message)
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
        this.onSubadminSubmit();
      }
    }
  }

}
