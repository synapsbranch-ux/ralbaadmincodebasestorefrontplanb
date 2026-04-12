import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';


@Component({
  selector: 'product-status-change',
  templateUrl: './product-status-change.component.html',
  styleUrls: ['./product-status-change.component.scss']
})
export class ProductStatusChangeComponent implements  OnInit {
  renderValue: string;
  renderValueOpp: string;
  editBtnColor: string;
  userrole:any;
  isAdmin:boolean =false;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor( private productservice: ProductService, private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {

    this.userrole=localStorage.getItem("user_role");
    if(this.userrole == 'admin'){
      this.isAdmin=true;
    }

    this.renderValue = this.rowData.status;
    if(this.rowData.status == 'active'){  
        this.renderValue='active';
        this.renderValueOpp='Pending';
    }
    else
    {
        this.renderValue='pending';
        this.renderValueOpp='Active';
    }
  }

  statusChange()
  {
    if(this.renderValue == 'active')
    {
      this.renderValue= "pending"; 
      this.renderValueOpp='Active';
    }
    else
    {
      this.renderValue="active";
      this.renderValueOpp='Pending';
    }
      let jsondata=
      {
        "product_id": this.rowData._id,
        "status" : this.renderValue
    
      }
        this.productservice.statusChangeProductsByAdmin(jsondata).subscribe(
          res => {
            this.toastr.success('Product Updated','Success' );
            this.router.navigateByUrl('/vendors/create-vendors', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/vendors/vendor-product-list/'+this.rowData.product_owner._id]);
            });
            if(res.data.status == 'active'){  
                this.renderValue='active';
            }
            else
            {
                this.renderValue='pending';
            }
            // console.log('AS Status',res);  
          },
          error => {
            this.toastr.error(error.error.message)
        }
        ); 
  
  
  }
}