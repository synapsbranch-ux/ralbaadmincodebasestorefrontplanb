import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UpdateShippingTaxService } from './update-shipping-tax.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-shipping-tax',
  templateUrl: './update-shipping-tax.component.html',
  styleUrls: ['./update-shipping-tax.component.scss']
})
export class UpdateShippingTaxComponent implements OnInit {


  userrole: any;
  isAdmin: boolean = false;
  public updateShippingForm: FormGroup;
  shipping_charge_value: any;
  tax_percentage_value: any;
  vendorType: any;
  constructor(private toastrService: ToastrService, public updateShippingTaxService: UpdateShippingTaxService, private route: ActivatedRoute, private router: Router) {
    this.updateShippingForm = new FormGroup({
      'shipping_charge': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(3)]),
      'tax_percentage': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(2)]),
    })
  }



  ngOnInit() {
    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::", this.vendorType);

    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.getShippingTax();
  }

  get shipping_charge() { return this.updateShippingForm.get('shipping_charge'); }
  get tax_percentage() { return this.updateShippingForm.get('tax_percentage'); }

  getShippingTax() {
    this.updateShippingTaxService.getShippingTax().subscribe(
      res => {
        this.shipping_charge_value = res.data[0].shipping_charge;
        this.tax_percentage_value = res.data[0].tax_percentage;
        console.log(res.data[0]);
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    )
  }


  onupdateShippingFormubmit(): void {
    if (this.updateShippingForm.invalid) {
      this.updateShippingForm.markAllAsTouched();
      return;
    }

    let formData = this.updateShippingForm.value;
    let shippingTaxObj =
    {
      shipping_charge: formData.shipping_charge.toString(),
      tax_percentage: formData.tax_percentage.toString()
    }

    if (this.isAdmin) {
      this.updateShippingTaxService.updateShippingTaxAdmin(shippingTaxObj).subscribe(
        res => {
          this.toastrService.success('Shipping and Tax update successfully')
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }
    else {
      if (this.vendorType !== 'access') {
        this.updateShippingTaxService.updateShippingTaxVendor(shippingTaxObj).subscribe(
          res => {
            this.toastrService.success('Shipping and Tax update successfully')
          },
          error => {
            this.toastrService.error(error.error.message)
          }
        )
      }

    }


  }


}
