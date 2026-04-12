import { ProductService } from './../../products/product.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorsService } from './../vendor.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-vendor-store',
  templateUrl: './list-vendor-store.component.html',
  styleUrls: ['./list-vendor-store.component.scss']
})
export class ListVendorStoreComponent implements OnInit {

  userrole:any;
  isAdmin:boolean =false;
  storeLists=[];
  storeavailable:boolean=false;
  storeurl=environment.storeURL
  store:any;
  store_status:any;


  constructor( private router: Router, private route: ActivatedRoute, private vendorsService: VendorsService, private toastr: ToastrService ) {

  }


ngOnInit() {
  
this.userrole=localStorage.getItem("user_role");
if(this.userrole == 'admin'){
  this.isAdmin=true;
}
  this.allStoreList();

}

allStoreList() {
  let storelist=
  {
    'page': '1',
    'limit': '10',
    'vendor_id': this.route.snapshot.paramMap.get('id'),
  }

  this.vendorsService.allStorelistvAdmin(storelist).subscribe(
    res =>{
      this.storeLists=res['data'];
      if(this.storeLists.length > 0)
      {
        this.storeavailable=true;
      }
      else
      {
        this.storeavailable=false;
      }
      // console.log('List Of Store API ==== ',res);
    },
    error => {
      this.toastr.error(error.error.message)
  }
  )



} 

view_store(store_id)
{
  this.router.navigate(['/vendors/edit-vendor-store/'+store_id]);
  // console.log('Store Edit', store_id);
}

statusChange(store_id:any,store_status:any)
{

  if(store_status == 'active')
  {
    this.store_status='pending'
  }
  else
  {
    this.store_status='active'
  }

  let sSdata=
  {
    store_id: store_id,
    status : this.store_status
  }
  this.vendorsService.storeStatusChanageAdmin(sSdata).subscribe(
    res =>{
      this.toastr.success('Store Updated','Success' );
      this.allStoreList();
      // console.log('Store Status API call ==== ',res);
    },
    error => {
      this.toastr.error(error.error.message)
  }
  )
}


}
