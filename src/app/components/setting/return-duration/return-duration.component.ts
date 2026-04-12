import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ReturnDurationService } from './return-duration.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-return-duration',
  templateUrl: './return-duration.component.html',
  styleUrl: './return-duration.component.scss'
})
export class ReturnDurationComponent {

  userrole: any;
  isAdmin: boolean = false;
  public returnDurationForm: FormGroup;
  return_duration_value: any;
  vendorType: any;
  constructor(private toastrService: ToastrService, public returnDurationService: ReturnDurationService, private route: ActivatedRoute, private router: Router) {
    this.returnDurationForm = new FormGroup({
      'return_duration': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(3)]),
    })
  }



  ngOnInit() {
    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::", this.vendorType);

    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.getReturnDuration();
  }

  get return_duration() { return this.returnDurationForm.get('return_duration'); }

  getReturnDuration() {
    this.returnDurationService.getReturnDuration().subscribe(
      res => {
        this.return_duration_value = res.data.return_duration;
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    )
  }


  onReturnDurationFormSubmit(): void {
    if (this.returnDurationForm.invalid) {
      this.returnDurationForm.markAllAsTouched();
      return;
    }

    let formData = this.returnDurationForm.value;
    let returnDurationObj = {
      return_duration: formData.return_duration.toString()
    }

    if (this.isAdmin) {
      this.returnDurationService.updateReturnDuration(returnDurationObj).subscribe(
        res => {
          this.toastrService.success('Return Duration updated successfully')
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }

  }

}
