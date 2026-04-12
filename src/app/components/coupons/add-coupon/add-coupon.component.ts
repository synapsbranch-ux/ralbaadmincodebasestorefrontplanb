import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CouponServiceService } from '../coupon-service.service';


@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrl: './add-coupon.component.scss'
})
export class AddCouponComponent {

  userrole: any;
  isAdmin: boolean = false;
  public addCouponForm: FormGroup;
  vendorType: any;
  constructor(private toastrService: ToastrService, private route: ActivatedRoute, private router: Router, private CouponServiceService: CouponServiceService) {
    this.addCouponForm = new FormGroup({
      coupon_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      type: new FormControl(null, Validators.required),
      discount: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.min(0)
      ]),
      min_order_amount: new FormControl(null, [
        Validators.min(0)
      ]),
      per_user_limit: new FormControl({ value: 1, disabled: true }, [
        Validators.required,
        Validators.min(1)
      ]),
      description: new FormControl(null, Validators.required),
      start_date: new FormControl(null, Validators.required),
      end_date: new FormControl(null, Validators.required),
    });

  }



  ngOnInit() {
    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::", this.vendorType);

    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }



    this.type.valueChanges.subscribe(value => {
      if (value) {
        this.discount.enable();
      } else {
        this.discount.disable();
      }
      const discountCtrl = this.discount;

      if (value === 'percentage') {
        discountCtrl.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]);
      } else {
        discountCtrl.setValidators([
          Validators.required,
          Validators.min(0)
        ]);
      }

      discountCtrl.updateValueAndValidity();
    });




    [
      'type',
      'discount',
      'min_order_amount',
      'per_user_limit',
      'start_date',
      'end_date'
    ].forEach(field => {
      this.addCouponForm.get(field)?.valueChanges.subscribe(() => {
        const desc = this.buildDescription();
        if (desc) {
          this.description.setValue(desc, { emitEvent: false });
        }
      });
    });


  }


  // Getters
  get coupon_name() { return this.addCouponForm.get('coupon_name')!; }
  get type() { return this.addCouponForm.get('type')!; }
  get discount() { return this.addCouponForm.get('discount')!; }
  get min_order_amount() { return this.addCouponForm.get('min_order_amount')!; }
  get per_user_limit() { return this.addCouponForm.get('per_user_limit')!; }
  get description() { return this.addCouponForm.get('description')!; }
  get start_date() { return this.addCouponForm.get('start_date')!; }
  get end_date() { return this.addCouponForm.get('end_date')!; }


  buildDescription(): string {
    const type = this.type.value;
    const discount = this.discount.value;
    const minOrder = this.min_order_amount.value;
    const per_user_limit = this.per_user_limit.value;
    const startDate = this.start_date.value;
    const endDate = this.end_date.value;


    // Required fields check (min_order_amount removed)
    if (!type || !discount || !startDate || !endDate || !per_user_limit) {
      return '';
    }

    const discountText =
      type === 'percentage'
        ? `${discount}%`
        : `$${discount}`;

    const minOrderText =
      !minOrder || Number(minOrder) === 0
        ? 'There is no minimum order for this coupon.'
        : `The coupon is valid for minimum order value of $${minOrder}.`;

    const perUserLimitText =
      Number(per_user_limit) > 1
        ? 'Customers can use the coupon on multiple transaction.'
        : `Customers can use the coupon on single transaction.`;

    return `Get Flat ${discountText} discount on your order.
${minOrderText}
${perUserLimitText}
The coupon is valid from ${startDate} to ${endDate}.`;
  }



  onaddCouponFormSubmit(): void {
    if (this.addCouponForm.invalid) {
      this.addCouponForm.markAllAsTouched();
      return;
    }

    // Use getRawValue to include disabled fields
    const formData = this.addCouponForm.getRawValue();
    console.log('Form Data:', formData);
    let addCouponObj = {
      coupon_name: formData.coupon_name,
      type: formData.type,
      discount: formData.discount,
      min_order_amount: formData.min_order_amount,
      per_user_limit: formData.per_user_limit,
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description
    }

    console.log('Add Coupon Object:', addCouponObj);

    if (this.isAdmin) {
      this.CouponServiceService.addCoupon(addCouponObj).subscribe(
        res => {
          if(res.message==='Success'){
            this.toastrService.success('Coupon added successfully')
          }else{
            this.toastrService.error(res.message)
          }
          console.log(res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }
  }

}
