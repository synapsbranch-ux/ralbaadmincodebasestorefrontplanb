import { VendorsService } from './../vendor.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'vendor-action-btn',
  templateUrl: './vendor-action-btn.component.html',
  styleUrls: ['./vendor-action-btn.component.scss']
})
export class VendorActionBtnComponent implements OnInit {
  renderValue: string;
  editBtnColor: string;
  statusactive:boolean=false;
  statusinactive:boolean=false; 
  statuspending:boolean=false; 
  vendor_status_name

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(  private router: Router, private toastr : ToastrService, private vendorlistService: VendorsService, private route : Router) {

  }
  ngOnInit() {

    this.renderValue = this.rowData.status;

    if(this.renderValue == 'active')
    {
      this.vendor_status_name="active"; 
    }
    else
    {
      this.vendor_status_name="pending";
    }

  }

  onClick() {
    this.router.navigate(['/users/user-order-list/'+this.rowData._id]);

  }

  viewStore()
  {
    this.router.navigate(['/vendors/list-vendor-store/'+this.rowData._id]);
  }

  viewDepartments()
  {
    this.router.navigate(['/vendors/vendor-department-list/'+this.rowData._id]);
  }

  viewRooms()
  {
    this.router.navigate(['/vendors/vendor-list-room/'+this.rowData._id]);
  }

  viewProducts()
  {
    this.router.navigate(['/vendors/vendor-product-list/'+this.rowData._id]);
  }

  viewOrder()
  {
    this.router.navigate(['/vendors/vendor-order-list/'+this.rowData._id]);
  }


  statusChange()
  {

  if(this.renderValue == 'active')
    {
      this.vendor_status_name="pending"; 
    }
    else
    {
      this.vendor_status_name="active";
    }

      let jsondata=
      {
        "vendor_id": this.rowData._id,
        "status" : this.vendor_status_name
    
      }
    
        this.vendorlistService.vendorStatuschange(jsondata).subscribe(
          res => {
            this.toastr.success('Vendor Status Updated','Success' );
            this.router.navigateByUrl('/vendors/create-vendors', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/vendors/list-vendors']);
            });
            // this.vendorlistService.allVendorList().subscribe(
            //   res =>
            //   {
            //     this.save.emit(res['data']);
            //   }
            // )
            if(res.data['status'] == 'active'){  
              this.renderValue='active';
              this.statusactive=true;
              this.statusinactive=false; 
              this.statuspending=false; 
          }
          else
          {
              this.renderValue='inactive';
              this.statusactive=false;
              this.statusinactive=true; 
              this.statuspending=false; 
          }
          },
          error => {
            this.toastr.error(error.error.message)
        }
        ); 
  
  }

  edit_vendor()
  {
    this.router.navigate(['/vendors/edit-vendor/'+this.rowData._id]);

  }

  bannerList()
  {
    this.router.navigate(['/vendors/vendor-banner-list/'+this.rowData._id]); 
  }


}