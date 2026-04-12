import { OrderService } from './../order.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-room',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {


  @ViewChild('addonsDetails', { static: true })
  addonsDetails!: TemplateRef<any>;
  closeResult = '';
  cartproducts = [];
  product_img: any;
  oderProducts = [];
  orderAddress: any
  total_order_amount: any
  discount: any
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
  productDetails = []
  shipping_charge_value = 0;
  tax_percentage_value = 0;
  vendorType: any
  return_reason: any
  couponName: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private orderservice: OrderService, private dialog: MatDialog, private toastrService: ToastrService, private modalService: NgbModal, private location: Location) {

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
    this.vendorType = localStorage.getItem('vendor_type');

    let oData = {
      order_id: this.route.snapshot.paramMap.get('id')
    }

    if (this.userrole == 'vendor') {
      this.singleOrderDetailsFetch(oData);
    }

    if (this.userrole == 'admin') {
      this.orderservice.adminsingleOrderDetails(oData).subscribe
        (
          res => {
            console.log('Order Details Response for Admin:', res['data'][0]);
            this.order_id = res['data'][0]._id;
            this.oderProducts = res['data'][0].order_details;
            this.orderAddress = res['data'][0].shipping_address_id;
            this.total_order_amount = res['data'][0].total_order_amount;
            this.discount = res['data'][0].discount ? res['data'][0].discount : 0;
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
            this.shipping_charge_value = res['data'][0].shipping_charge;
            this.tax_percentage_value = res['data'][0].tax_amount;
            this.payment_method = res['data'][0].payment_method;
            this.productDetails = res['data'][0].products_details;
            this.expected_delivery = new Date(new Date(this.createdAt).setDate(new Date(this.createdAt).getDate() + 10));
            // console.log('Order Deatils',this.expected_delivery);
            this.return_reason = res['data'][0]?.return_reason;


            let orderData = {
              orderId: oData.order_id
            }
            this.orderservice.getCouponByOrderId(orderData).subscribe(
              res => {
                console.log('Coupon Details Response for Admin:', res);
                if (res['data']) {
                  this.couponName = res['data'].coupon_name;
                }
              },
              error => {
                this.toastrService.error(error.error.message)
              }
            );

          },
          error => {
            this.toastrService.error(error.error.message)
          }
        )
    }

  }

  singleOrderDetailsFetch(oData: any) {
    this.orderservice.singleOrderDetails(oData).subscribe
      (
        res => {
          this.order_id = res['data'][0]._id;
          this.oderProducts = res['data'][0].order_details;
          this.orderAddress = res['data'][0].shipping_address_id;
          this.total_order_amount = res['data'][0].total_order_amount;
          this.discount = res['data'][0].discount ? res['data'][0].discount : 0;
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
          this.shipping_charge_value = res['data'][0].shipping_charge;
          this.tax_percentage_value = res['data'][0].tax_amount;
          this.createdAt = res['data'][0].createdAt;
          this.payment_method = res['data'][0].payment_method;
          this.productDetails = res['data'][0].products_details;
          this.expected_delivery = new Date(new Date(this.createdAt).setDate(new Date(this.createdAt).getDate() + 10));
          // console.log('Order Deatils',this.expected_delivery);
          this.return_reason = res['data'][0]?.return_reason;
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
  }

  getCommissionCharge(product, chargeType: string) {
    if (product.commission_details && product.commission_details.length > 0) {
      const commissionDetail = product.commission_details[0]; // Assuming you always want the first commission_detail
      // Check if vendorSpecificCharges exists and contains the charge type
      if (commissionDetail.breakdownPercentage) {
        const charge = commissionDetail.breakdownPercentage.find(c => c.type == chargeType);
        if (charge) {
          let returnObj = {
            percentage: charge.percentage,
            price: charge.price
          }
          return returnObj;  // Return the charge price for the given charge type
        }
      }
    }
    let returnObj = {
      percentage: 0,
      price: 0
    }
    return returnObj;  // Return 0 if commission_details or charge type is not found
  }

  getStoreName(product, type: string) {
    if (product?.commission_details?.length > 0) {
      const commissionDetail = product.commission_details[0];

      if (commissionDetail.breakdownPercentage) {
        if (type === 'access') {
          const storeDetails = commissionDetail.breakdownPercentage.find(c => c.storeDetails);
          if (storeDetails?.storeDetails) {
            return storeDetails.storeDetails;
          }
        }

        if (type === 'main') {
          const storeDetails = commissionDetail.breakdownPercentage.find(c => c.mainStoreDetails);
          if (storeDetails?.mainStoreDetails) {
            return storeDetails.mainStoreDetails;
          }
        }
      }
    }

    // Return a fallback object to prevent errors in template
    return {
      store_slug: '',
      store_name: 'N/A'
    };
  }


  edit_room(room_id) {
    // console.log('Room Edit', room_id);
  }

  delete_room(room_id) {
    // console.log('Room Deleted', room_id);
  }

  findProductDetails(productId: string) {
    return this.productDetails.find(detail => detail._id === productId);
  }

  viewAddonsDetails(addonsjsondata, addonsDetails) {
    this.processedAddonsJson = this.processAddonsData(addonsjsondata);
    this.modalService.open(addonsDetails, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
    this.router.navigateByUrl(`order/order-payment-details/${this.order_id}`)
  }


  goBack() {
    this.location.back();
  }

  uploadFileAndData(files: FileList) {
    let fileToUpload = files.item(0);

    // Check if the file size exceeds 5MB
    const fileSizeInMB = fileToUpload.size / (1024 * 1024); // Convert bytes to MB
    if (fileSizeInMB > 5) {
      // Show error toaster message and return to prevent the upload
      this.toastrService.error('File size exceeds 5MB. Please select a smaller file.');
      return;
    }


    let imgobj = {}
    // // Proceed with the upload if the file size is within the limit
    this.orderservice.uploadImage(fileToUpload).subscribe(
      (res) => {
        imgobj = {
          key: "prescription_upload",
          fileUrl: res['data'].fileUrl,
          price: 0
        };

        this.orderservice.addonPrescriptionData(this.order_id, imgobj).subscribe(
          (res) => {
            this.toastrService.success('Prescription uploaded successfully');
            let oData = {
              order_id: this.route.snapshot.paramMap.get('id')
            }
            this.singleOrderDetailsFetch(oData);
          },
          error => {
            this.toastrService.error(error.error.message);
          }
        );
      },
      error => {
        this.toastrService.error(error.error.message);
      }
    );
  }


  uploadPrescription() {
    const fileInput = document.getElementById('uploadPres') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      this.uploadFileAndData(fileInput.files);
    
      fileInput.value = '';
  
    } else {
      this.toastrService.error('Please select a prescription file to upload.');
    }
  }

}
