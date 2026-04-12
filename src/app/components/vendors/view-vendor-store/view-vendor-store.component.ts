import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { VendorsService } from './../vendor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-vendor-store',
  templateUrl: './view-vendor-store.component.html',
  styleUrls: ['./view-vendor-store.component.scss']
})
export class ViewVendorStoreComponent implements OnInit {
  uploadStoreImages= [];

  storeinsertValid: boolean = false;
  storeinsertMessage:any

  storename:any;
  storelocation:any;
  storeimage:any;
  vendor_id:any;

  userrole:any;
  isAdmin:boolean =false;

  updatejson:any;

  public storeSubmitForm: FormGroup;

  constructor( private vendorsService: VendorsService, private route: ActivatedRoute, private router : Router, private toastrService:ToastrService) { 

  }

   

  ngOnInit() {

    let store_id=
    {
      "store_id": this.route.snapshot.paramMap.get('id'),
    }
   
    this.vendorsService.singleStoreDetailsvAdmin(store_id).subscribe(
      res =>
      {
        this.storename=res['data'].store_name;
        this.storelocation=res['data'].store_location;
        this.storeimage=res['data'].store_image;
        this.vendor_id=res['data'].store_owner._id;
        // console.log('Single Store Details =====',res['data'])
  
      },
      error => {
        this.toastrService.error(error.error.message)
    }
    );


}



}
