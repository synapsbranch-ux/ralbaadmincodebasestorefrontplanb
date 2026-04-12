import { OrderService } from '../order.service';
import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TimingService } from 'src/app/timing.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-status-change-return',
  templateUrl: './order-status-change-return.component.html',
  styleUrl: './order-status-change-return.component.scss'
})
export class OrderStatusChangeReturnComponent implements OnInit {


  @ViewChild('addonsDetails', { static: true })
  addonsDetails!: TemplateRef<any>;
  userrole: any;

  cartproducts = [];
  product_img: any;
  oderProducts = [];
  orderAddress: any
  total_order_amount: any
  order_status: any
  payment_status: any
  transaction_id: any
  billing_email: any
  billing_phone: any
  billing_country: any
  billing_first_name: any
  billing_last_name: any
  billing_address1: any
  billing_address2: any
  billing_city: any
  billing_state: any
  billing_zip: any
  createdAt: any
  payment_method: any
  order_id: any;
  expected_delivery: any
  isAdmin: boolean = false;
  currentVendor: any;
  orderStatuslist =
    [
      {
        orderstatus: "return requested"
      },
      {
        orderstatus: "return approved"
      },
      {
        orderstatus: "return in transit"
      },
      {
        orderstatus: "return received"
      },
      {
        orderstatus: "refunded"
      },
    ];
  orderstatusChange: boolean = false;
  orderSucessMsg: any;
  addonsjson = [];
  public orderSubmitForm: FormGroup;
  formattedDeliveryDate: any
  currentUser: any
  processedAddonsJson: any[] = [];  // Store processed data here
  constructor(private route: ActivatedRoute, private orderservice: OrderService, private router: Router, private dialog: MatDialog, private toastrService: ToastrService, private ngZone: NgZone, private location: Location) {

  }


  ngOnInit() {
    if (localStorage.getItem('current_user')) {
      this.currentUser = localStorage.getItem('current_user')
    }
    if (localStorage.getItem('vendor_id_order')) {
      this.currentVendor = localStorage.getItem('vendor_id_order')
    }
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

    this.orderSubmitForm = new FormGroup({
      'orderStatus': new FormControl(null, [Validators.required]),
      'delivery_date': new FormControl(null, [Validators.required]),
    });

    let oData = {
      order_id: this.route.snapshot.paramMap.get('id')
    }

    if (this.isAdmin) {
      this.orderservice.singleOrderDetailsAdmin(oData).subscribe
        (
          res => {
            this.order_id = res['data'][0]._id;
            this.oderProducts = res['data'][0].order_details;
            this.orderAddress = res['data'][0].shipping_address_id;
            this.total_order_amount = res['data'][0].total_order_amount;
            this.order_status = res['data'][0].order_status;
            this.payment_status = res['data'][0].payment_status;
            this.transaction_id = res['data'][0].transaction_id;
            this.billing_email = res['data'][0].billing_email;
            this.billing_phone = res['data'][0].billing_phone;
            this.billing_country = res['data'][0].billing_country;
            this.billing_first_name = res['data'][0].billing_first_name;
            this.billing_last_name = res['data'][0].billing_last_name;
            this.billing_address1 = res['data'][0].billing_address1;
            this.billing_address2 = res['data'][0].billing_address2;
            this.billing_city = res['data'][0].billing_city;
            this.billing_state = res['data'][0].billing_state;
            this.billing_zip = res['data'][0].billing_zip;
            this.createdAt = res['data'][0].createdAt;
            this.payment_method = res['data'][0].payment_method;
            this.expected_delivery = res['data'][0].order_delivery_date;
            console.log('this.expected_delivery-----------', this.expected_delivery);
            let date = new Date(this.expected_delivery);
            this.formattedDeliveryDate = date.toISOString().split('T')[0];  // Convert to YYYY-MM-DD format
          },
          error => {
            this.toastrService.error(error.error.message)
          }
        )
    }
    else {
      this.orderservice.singleOrderDetails(oData).subscribe
        (
          res => {
            this.order_id = res['data'][0]._id;
            this.oderProducts = res['data'][0].order_details;
            this.orderAddress = res['data'][0].shipping_address_id;
            this.total_order_amount = res['data'][0].total_order_amount;
            this.order_status = res['data'][0].order_status;
            this.payment_status = res['data'][0].payment_status;
            this.transaction_id = res['data'][0].transaction_id;
            this.billing_email = res['data'][0].billing_email;
            this.billing_phone = res['data'][0].billing_phone;
            this.billing_country = res['data'][0].billing_country;
            this.billing_first_name = res['data'][0].billing_first_name;
            this.billing_last_name = res['data'][0].billing_last_name;
            this.billing_address1 = res['data'][0].billing_address1;
            this.billing_address2 = res['data'][0].billing_address2;
            this.billing_city = res['data'][0].billing_city;
            this.billing_state = res['data'][0].billing_state;
            this.billing_zip = res['data'][0].billing_zip;
            this.createdAt = res['data'][0].createdAt;
            this.payment_method = res['data'][0].payment_method;
            this.expected_delivery = res['data'][0].order_delivery_date;
            let date = new Date(this.expected_delivery);
            this.formattedDeliveryDate = date.toISOString().split('T')[0];  // Convert to YYYY-MM-DD format
          },
          error => {
            this.toastrService.error(error.error.message)
          }
        )
    }


  }


  get orderStatus() { return this.orderSubmitForm.get('orderStatus').value; }
  get delivery_date() { return this.orderSubmitForm.get('delivery_date').value; }

  onOrderEdit() {
    let formData = this.orderSubmitForm.value;

    let oData =
    {
      order_id: this.order_id,
      order_status: formData.orderStatus,
      order_delivery_date: formData.delivery_date
    }

    if (this.isAdmin) {
      this.orderservice.singleOrderUpdateAdmin(oData).subscribe(
        res => {
          this.orderSucessMsg = "Order Status Updated successfully";
          this.orderstatusChange = true;

          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  if (localStorage.getItem('vendor_id_order')) {
                    // this.router.navigate([`/vendors/vendor-order-list/${localStorage.getItem('vendor_id_order')}`]);
                    this.location.back();
                  }
                  else {
                    // this.router.navigate(['/order/order-list']);
                    this.location.back();
                  }

                });
              } else {
                requestAnimationFrame(checkTime);
              }
            };
            requestAnimationFrame(checkTime);
          });
          /// settimeout End

          // console.log('Order Data Update ',res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }
    else {
      this.orderservice.singleOrderUpdate(oData).subscribe(
        res => {
          this.orderSucessMsg = "Order Status Updated successfully";
          this.orderstatusChange = true;
          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  // this.router.navigate(['/order/order-list']);
                  this.location.back();
                });
              } else {
                requestAnimationFrame(checkTime);
              }
            };
            requestAnimationFrame(checkTime);
          });
          /// settimeout End

          // console.log('Order Data Update ',res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }



  }


  viewAddonsDetails(addonsjsondata) {
    this.processedAddonsJson = this.processAddonsData(addonsjsondata);
    const dialogRef = this.dialog.open(this.addonsDetails, {
      disableClose: false,
      autoFocus: true,
      restoreFocus: true,
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
      this.router.navigate([this.router.url]);
    });
  }



  private processAddonsData(addonsjsondata: any[]): any[] {
    // Return a new array to avoid direct mutation
    return addonsjsondata.map(addon => {
      return {
        ...addon,
        key: this.capitalizeString(addon.key),
        value: this.capitalizeString(addon.value),
        extra_document: addon.extra_document?.map(adn => {
          return {
            ...adn,
            keyname: this.capitalizeString(adn.keyname),
          };
        }) || []
      };
    });
  }

  private capitalizedCache = new Map<string, string>();

  capitalizeString(str: string): string {
    if (str && !this.capitalizedCache.has(str)) {
      console.log('str =============?', str);
      let words = str.split(/[_-]/);
      let capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      let capitalizedString = capitalizedWords.join(' ');
      this.capitalizedCache.set(str, capitalizedString);
      return capitalizedString;
    } else {
      return this.capitalizedCache.get(str) || str;
    }
  }


  goBack() {
    this.location.back();
  }



}
