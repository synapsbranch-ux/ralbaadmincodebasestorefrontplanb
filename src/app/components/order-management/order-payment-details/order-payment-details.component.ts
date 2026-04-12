import { OrderService } from './../order.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-payment-details',
  templateUrl: './order-payment-details.component.html',
  styleUrls: ['./order-payment-details.component.scss']
})
export class OrderPaymentDetailsComponent implements OnInit {


  @ViewChild('addonsDetails', { static: true })
  addonsDetails!: TemplateRef<any>;

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
  addonsjson = [];
  processedAddonsJson: any[] = [];  // Store processed data here
  userrole: any;
  isAdmin: boolean = false;
  currentVendor: any;
  currentUser
  paymentId: any
  constructor(private route: ActivatedRoute, private router: Router, private orderservice: OrderService, private dialog: MatDialog, private toastrService: ToastrService) {

  }


  ngOnInit() {
    if (localStorage.getItem('vendor_id_order')) {
      this.currentVendor = localStorage.getItem('vendor_id_order')
    }
    if (localStorage.getItem('current_user')) {
      this.currentUser = localStorage.getItem('current_user')
    }
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

    let oData = {
      order_id: this.route.snapshot.paramMap.get('id')
    }

    if (this.userrole == 'vendor') {
      this.orderservice.singleOrderDetails(oData).subscribe
        (
          res => {
            this.order_id = res['data'][0]._id;
            this.oderProducts = res['data'][0].order_details;
            this.orderAddress = res['data'][0].shipping_address_id;
            this.total_order_amount = res['data'][0].total_order_amount;
            this.order_status = res['data'][0].order_status;
            this.payment_status = res['data'][0].payment_status;
            this.paymentId = res['data'][0].payment_id;
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
            this.expected_delivery = new Date(new Date(this.createdAt).setDate(new Date(this.createdAt).getDate() + 10));
            // console.log('Order Deatils',this.expected_delivery);
          },
          error => {
            this.toastrService.error(error.error.message)
          }
        )
    }

    if (this.userrole == 'admin') {
      this.orderservice.adminsingleOrderDetails(oData).subscribe
        (
          res => {
            this.order_id = res['data'][0]._id;
            this.oderProducts = res['data'][0].order_details;
            this.orderAddress = res['data'][0].shipping_address_id;
            this.total_order_amount = res['data'][0].total_order_amount;
            this.order_status = res['data'][0].order_status;
            this.payment_status = res['data'][0].payment_status;
            this.paymentId = res['data'][0].payment_id;
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
            this.expected_delivery = new Date(new Date(this.createdAt).setDate(new Date(this.createdAt).getDate() + 10));
            // console.log('Order Deatils',this.expected_delivery);
          },
          error => {
            this.toastrService.error(error.error.message)
          }
        )
    }

  }

  edit_room(room_id) {
    // console.log('Room Edit', room_id);
  }

  delete_room(room_id) {
    // console.log('Room Deleted', room_id);
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
    console.log('addonsjson =========>', this.addonsjson);
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


  paymentDetails() {

  }

}
