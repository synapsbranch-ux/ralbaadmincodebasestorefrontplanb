import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CouponServiceService } from '../coupon-service.service';


@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrl: './edit-coupon.component.scss'
})
export class EditCouponComponent {

  userrole: any;
  isAdmin: boolean = false;
  public updateCouponForm: FormGroup;
  coupon_name_value: any;
  vendorType: any;


  uCouponName: any;
  uType: any;
  uDiscount: any;
  uMinOrderAmount: any;
  uPerUserLimit: any;
  uDescription: any;
  uStartDate: any;
  uEndDate: any;
  coupon_id: any





  constructor(private toastrService: ToastrService, private route: ActivatedRoute, private router: Router, private CouponServiceService: CouponServiceService) {
    this.updateCouponForm = new FormGroup({
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



    let cdata = {
      "coupon_id": this.route.snapshot.paramMap.get('id')
    }

    this.CouponServiceService.singleCouponDetails(cdata).subscribe(
      res => {
        // console.log('customer Details', res);
        this.uCouponName = res['data'].coupon_name;
        this.uType = res['data'].type;
        this.uDiscount = res['data'].discount;
        this.uMinOrderAmount = res['data'].min_order_amount;
        this.uPerUserLimit = res['data'].per_user_limit;
        this.uDescription = res['data'].description;
        this.uStartDate = res['data'].start_date;
        this.uEndDate = res['data'].end_date;
        this.coupon_id = res['data']._id;

        // Update form values
        this.updateCouponForm.patchValue({
          coupon_name: this.uCouponName,
          type: this.uType,
          discount: this.uDiscount,
          min_order_amount: this.uMinOrderAmount,
          per_user_limit: this.uPerUserLimit,
          description: this.uDescription,
          start_date: this.uStartDate,
          end_date: this.uEndDate
        });
      }
    )

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
      this.updateCouponForm.get(field)?.valueChanges.subscribe(() => {
        const desc = this.buildDescription();
        if (desc) {
          this.description.setValue(desc, { emitEvent: false });
        }
      });
    });


  }


  // Getters
  get coupon_name() { return this.updateCouponForm.get('coupon_name')!; }
  get type() { return this.updateCouponForm.get('type')!; }
  get discount() { return this.updateCouponForm.get('discount')!; }
  get min_order_amount() { return this.updateCouponForm.get('min_order_amount')!; }
  get per_user_limit() { return this.updateCouponForm.get('per_user_limit')!; }
  get description() { return this.updateCouponForm.get('description')!; }
  get start_date() { return this.updateCouponForm.get('start_date')!; }
  get end_date() { return this.updateCouponForm.get('end_date')!; }


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



  onupdateCouponFormSubmit(): void {
    if (this.updateCouponForm.invalid) {
      this.updateCouponForm.markAllAsTouched();
      return;
    }

    // Use getRawValue to include disabled fields
    const formData = this.updateCouponForm.getRawValue();
    console.log('Form Data:', formData);
    let updateCouponObj = {
      coupon_name: formData.coupon_name,
      type: formData.type,
      discount: formData.discount,
      min_order_amount: formData.min_order_amount,
      per_user_limit: formData.per_user_limit,
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description
    }

    console.log('update Coupon Object:', updateCouponObj);


    if (this.isAdmin) {
      this.CouponServiceService.updateCoupon(this.coupon_id, updateCouponObj).subscribe(
        res => {
          if(res.message==='Success'){
            this.toastrService.success('Coupon updated successfully')
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
