import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../store.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-store',
  templateUrl: './list-store.component.html',
  styleUrls: ['./list-store.component.scss']
})
export class ListStoreComponent implements OnInit {
  @ViewChild('storeDelete', { static: true })
  storeDelete!: TemplateRef<any>;

  userrole: any;
  isAdmin: boolean = false;
  storeLists = [];
  storeavailable: boolean = false;
  delete_store_id: any;
  delete_storeby_vendor: any;
  storeurl = environment.storeURL
  store: any;
  store_status_name: any;
  vendorType:any;

  constructor(private router: Router, private storeservice: StoreService, private route: ActivatedRoute, private dialog: MatDialog, private toastrService: ToastrService) {

  }


  ngOnInit() {

    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.allStoreList();
    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::",this.vendorType);
  }

  allStoreList() {
    let storelist =
    {
      'page': '1',
      'limit': '10'
    }

    /////  Vendor All Store   ///////

    if (this.userrole == 'vendor') {
      this.storeservice.allStorelist(storelist).subscribe(
        res => {
          this.storeLists = res['data'];
          if (this.storeLists.length > 0) {
            this.storeavailable = true;
          }
          else {
            this.storeavailable = false;
          }
          // console.log('List Of Store API ==== ',res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )

    }

    /////  Admin All Store   /////////

    if (this.userrole == 'admin') {
      this.storeservice.allStorelistAdmin(storelist).subscribe(
        res => {
          this.storeLists = res['data'];
          if (this.storeLists.length > 0) {
            this.storeavailable = true;
          }
          else {
            this.storeavailable = false;
          }
          // console.log('List Of Store API ==== ',res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )

    }



  }

  edit_store(store_id) {
    this.router.navigate(['/stores/edit-store/' + store_id]);
    // console.log('Store Edit', store_id);
  }

  delete_store(store_id, vendor_id) {
    this.delete_store_id = store_id;
    this.delete_storeby_vendor = vendor_id;
    this.dialog.open(this.storeDelete, { disableClose: false, width: '100%', maxWidth: '350px' });
  }

  deleteConfirm() {

    ////////////////// Vendor Delete Store    /////////////////


    if (this.userrole == 'vendor') {
      this.store =
      {
        "store_id": this.delete_store_id
      }

      this.storeservice.singleStoreDelete(this.store).subscribe(
        res => {
          this.allStoreList();
          this.toastrService.success('Your Store Deleted Successfully');
          this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/stores/list-store']);
          });
          // console.log('Store Deleted', res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }
    if (this.userrole == 'admin') {
      this.store =
      {
        "store_id": this.delete_store_id,
        "store_owner_id": this.delete_storeby_vendor,
      }

      this.storeservice.singleStoreDeleteAdmin(this.store).subscribe(
        res => {
          this.allStoreList();
          this.toastrService.success('Your Store Deleted Successfully');
          // console.log('Store Deleted', res);
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }


  }

  statusChange(store_id, vendor_id, status_name) {
    if (status_name == 'active') {
      this.store_status_name = "inactive";
    }
    if (status_name == 'inactive') {
      this.store_status_name = "active";
    }
    let jsondata =
    {
      "store_id": store_id,
      "store_owner_id": vendor_id,
      "status": this.store_status_name

    }

    this.storeservice.singleStoreStatuschange(jsondata).subscribe(
      res => {
        this.allStoreList();
        // console.log('Store Updated',res);
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );


  }


}
