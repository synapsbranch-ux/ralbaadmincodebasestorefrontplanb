import { SubAdminService } from './../sub-admin.service';
import { ToastrService } from 'ngx-toastr';
import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-sub-admin',
  templateUrl: './edit-sub-admin.component.html',
  styleUrls: ['./edit-sub-admin.component.scss']
})
export class EditSubAdminComponent implements OnInit {
  subadmininsertValid: boolean = false;
  subadmininsertMessage: any
  departrmentinsertimgValid: boolean = false;

  subadminName: any;
  subadminEmail: any;

  userrole: any;
  isAdmin: boolean = false;

  closeResult = '';


  public subadminSubmitForm: FormGroup;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public departmentservice: SubAdminService, private route: ActivatedRoute, private router: Router, private toster: ToastrService, private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }


    this.subadminSubmitForm = new FormGroup({
      'subadmin_name': new FormControl(null, [Validators.required, Validators.pattern(/^(?! )[a-zA-Z ]*$/)]),
      'subadmin_email': new FormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    });

    if (this.userrole == 'admin') {

      let SAData =
      {
        "subadmin_id": this.route.snapshot.paramMap.get('id')
      }

      this.departmentservice.singleSubadminDetails(SAData).subscribe(
        res => {
          this.subadminName = res['data'][0].name;
          this.subadminEmail = res['data'][0].email;
          // console.log('Single Subadmin Details =====',res['data'])

        },
        error => {
          this.toster.error(error.error.message)
        });


    }
  }


  get subadmin_name() { return this.subadminSubmitForm.get('subadmin_name'); }
  get subadmin_email() { return this.subadminSubmitForm.get('subadmin_email'); }


  onSubadminEdit() {

    if (this.subadminSubmitForm.invalid) {
      this.subadminSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.subadminSubmitForm.value;

    let jsondata =
    {
      "subadmin_id": this.route.snapshot.paramMap.get('id'),
      "name": formData.subadmin_name,
      "email": formData.subadmin_email,
    }

    if (this.userrole == 'admin') {
      this.departmentservice.singleSubadminUpdateAdmin(jsondata).subscribe(
        res => {
          this.subadmininsertMessage = "Subadmin Updated successfully";
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
          this.toster.error(error.error.message)
        }
      );
    }
    // console.log('Subadmin Submitted');
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
        this.onSubadminEdit();
      }
    }
  }
}
