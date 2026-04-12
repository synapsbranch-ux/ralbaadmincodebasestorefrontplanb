import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommissionSetupService } from './commission-setup.service';

@Component({
  selector: 'commission-setup',
  templateUrl: './commission-setup.component.html',
  styleUrls: ['./commission-setup.component.scss']
})
export class CommissionSetupComponent implements OnInit {


  userrole: any;
  isAdmin: boolean = false;
  public updateShippingForm: FormGroup;
  platform_charge_percentage_value: any;
  copy_product_commission_value: any;
  glb_commission_value: any;

  vendorType: any;
  constructor(private toastrService: ToastrService, public updateShippingTaxService: CommissionSetupService, private route: ActivatedRoute, private router: Router) {
    this.updateShippingForm = new FormGroup({
      'platform_charge_percentage': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(2)]),
      'copy_product_commission': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(2)]),
      'glb_commission': new FormControl(null, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(2)]),
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

  get platform_charge_percentage() { return this.updateShippingForm.get('platform_charge_percentage'); }
  get copy_product_commission() { return this.updateShippingForm.get('copy_product_commission'); }
  get glb_commission() { return this.updateShippingForm.get('glb_commission'); }

  getShippingTax() {
    this.updateShippingTaxService.getCommissionDetails().subscribe(
      res => {
        const commissionData = res.data[0];  // Assuming you are getting the first item from data

        // Platform charge
        this.platform_charge_percentage_value = commissionData.platform_charge;

        // Find the "Copy Product" commission from vendor charges
        const copyProductCharge = commissionData.vendor_charges.find(charge => charge.charge_type === 'Copy Product');
        if (copyProductCharge) {
          this.copy_product_commission_value = copyProductCharge.charge_percentage;
        } else {
          this.copy_product_commission_value = 0;  // Handle if no Copy Product commission is found
        }

        // Find the "GLB asset" commission from vendor charges
        const assetProductCharge = commissionData.vendor_charges.find(charge => charge.charge_type === '3D Asset');
        if (assetProductCharge) {
          this.glb_commission_value = assetProductCharge.charge_percentage;
        } else {
          this.glb_commission_value = 0;  // Handle if no Copy Product commission is found
        }
      },
      error => {
        this.toastrService.error(error.error.message);
      }
    );
  }



  onupdateCommissionFormsubmit(): void {
    if (this.updateShippingForm.invalid) {
      this.updateShippingForm.markAllAsTouched();
      return;
    }

    let formData = this.updateShippingForm.value;
    let commissionObj =
    {
      "platform_charge": formData.platform_charge_percentage,
      "vendor_charges": [
        {
          "charge_type": "3D Asset",
          "charge_percentage": formData.glb_commission,
        },
        {
          "charge_type": "Copy Product",
          "charge_percentage": formData.copy_product_commission,
        }
      ]
    }

    if (this.isAdmin) {
      this.updateShippingTaxService.updateCommissionAdmin(commissionObj).subscribe(
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
