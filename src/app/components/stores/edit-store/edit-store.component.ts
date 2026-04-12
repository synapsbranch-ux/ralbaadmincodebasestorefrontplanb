import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StoreService } from '../store.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {

  @ViewChild('logoStatus') logoStatus!: ElementRef;

  storeinsertValid: boolean = false;
  storeinsertMessage: any
  domainName: any;
  storename: any;
  storeslug: any;
  storelocation: any;
  vendor_id: any;
  store_descs: any;
  userrole: any;
  isAdmin: boolean = false;
  updatejson: any;
  public storeSubmitForm: FormGroup;
  closeResult = '';
  private fileToUpload: File = null;
  store_glb_file_name: any
  store_glb_file: any
  store_jpg_file_name: any
  store_jpg_file: any
  upload3DImageStatus: string = '';
  upload3DImage = [];
  upload2DImageStatus: string = '';
  upload2DImage = [];
  storeProductJson: any;
  store_json_file_name: any;
  invalidForm: boolean = false;
  store_slug: any
  desableaddRooom: boolean = true;
  logo_status: boolean = false;
  logo_file_name: any
  logo_file: any
  uploadLogoStatus: string = '';
  logo_name_: any
  vendorType: any
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public storeservice: StoreService, private route: ActivatedRoute, private router: Router, private toster: ToastrService) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.vendorType = localStorage.getItem('vendor_type');
    this.storeSubmitForm = new FormGroup({
      'store_name': new FormControl(null, [Validators.required]),
      'store_location': new FormControl(null, [Validators.required]),
      'domain_name': new FormControl(null),
      'store_desc': new FormControl(null),
      'logo_name': new FormControl(null)
    });

    if (this.userrole == 'admin') {
      let store_id =
      {
        "store_id": this.route.snapshot.paramMap.get('id')
      }

      this.storeservice.singleStoreDetailsAdmin(store_id).subscribe(
        res => {
          this.storename = res['data'].store_name;
          this.storelocation = res['data'].store_location;
          this.domainName = res['data'].domain_name;
          this.store_descs = res['data'].store_description;
          this.store_jpg_file = res['data'].store_jpg_file;
          this.store_jpg_file_name = res['data'].store_jpg_file_name
          this.store_glb_file = res['data'].store_glb_file;
          this.store_json_file_name = res['data'].store_json_file_name
          if (this.store_glb_file) {
            const url = this.store_glb_file
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1];
            const fullstorename = lastPart.split('.');
            this.storeslug = fullstorename[fullstorename.length - 2];
          }
          this.logo_file = res['data'].logo
          this.logo_file_name = res['data'].logo_file_name
          this.logo_status = res['data'].is_logo
          this.logoStatus.nativeElement.checked = this.logo_status;
          this.logo_name_ = res['data'].logo_name
          this.store_slug = res['data'].store_slug;
          this.store_glb_file_name = res['data'].store_glb_file_name;
          this.storeProductJson = res['data'].store_products;
          let noofrooms = 0;
          noofrooms = this.storeProductJson.length;
          if (noofrooms > 0) {
            this.desableaddRooom = false;
            for (let i = 0; i < this.storeProductJson[noofrooms - 1].length; i++) {
              if (this.storeProductJson[noofrooms - 1][i].product_sku != "") {
                this.desableaddRooom = false;
              }
              else {
                this.desableaddRooom = true;
                break;
              }
            }
          }
          else {
            this.desableaddRooom = true;
          }

        },
        error => {
          this.toster.error(error.error.message)
        });
    }

    if (this.userrole == 'vendor') {
      let store_id =
      {
        "store_id": this.route.snapshot.paramMap.get('id')
      }

      this.storeservice.singleStoreDetails(store_id).subscribe(
        res => {
          this.storename = res['data'].store_name;
          this.storelocation = res['data'].store_location;
          this.domainName = res['data'].domain_name;
          this.store_descs = res['data'].store_description;
          this.store_jpg_file = res['data'].store_jpg_file;
          this.store_jpg_file_name = res['data'].store_jpg_file_name
          this.store_glb_file = res['data'].store_glb_file;
          this.store_json_file_name = res['data'].store_json_file_name
          if (this.store_glb_file) {
            const url = this.store_glb_file
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1];
            const fullstorename = lastPart.split('.');
            this.storeslug = fullstorename[fullstorename.length - 2];
          }
          this.logo_file = res['data'].logo
          this.logo_file_name = res['data'].logo_file_name
          this.logo_status = res['data'].is_logo
          this.logoStatus.nativeElement.checked = this.logo_status;
          this.logo_name_ = res['data'].logo_name
          this.store_slug = res['data'].store_slug;
          this.store_glb_file_name = res['data'].store_glb_file_name;
          this.storeProductJson = res['data'].store_products;
          let noofrooms = 0;
          noofrooms = this.storeProductJson.length;
          if (noofrooms > 0) {
            this.desableaddRooom = false;
            for (let i = 0; i < this.storeProductJson[noofrooms - 1].length; i++) {
              if (this.storeProductJson[noofrooms - 1][i].product_sku != "") {
                this.desableaddRooom = false;
              }
              else {
                this.desableaddRooom = true;
                break;
              }
            }
          }
          else {
            this.desableaddRooom = true;
          }

          // console.log('Single Store Details =====',res['data'])
          // console.log('noofrooms ============================>', noofrooms);
          // console.log('this.storeslug', this.storeslug);
        },
        error => {
          this.toster.error(error.error.message)
        }
      );

    }

    if (this.vendorType == 'access') {
      this.storeSubmitForm.get('store_location').disable();
      this.storeSubmitForm.get('store_desc').disable();
    }
  }


  // Create Room
  get store_name() { return this.storeSubmitForm.get('store_name') }
  get store_location() { return this.storeSubmitForm.get('store_location') }
  get domain_name() { return this.storeSubmitForm.get('domain_name') }
  get store_desc() { return this.storeSubmitForm.get('store_desc') }
  get logo_name() { return this.storeSubmitForm.get('logo_name') }

  opengbl(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  open(content2) {
    this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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


  processFile(files: FileList, type: any) {
    this.fileToUpload = files.item(0);

    if (type == 'glb') {
      this.store_glb_file_name = this.fileToUpload.name;
      this.upload3DImageStatus = 'uploading';
      // if(this.fileToUpload.size <= 2000000)
      // {
      this.storeservice.uploadImage(this.fileToUpload).subscribe(
        (res) => {
          this.store_glb_file = res['data'].fileUrl;
          const url = this.store_glb_file
          const parts = url.split('/');
          const lastPart = parts[parts.length - 1];
          const fullstorename = lastPart.split('.');
          this.storeslug = fullstorename[fullstorename.length - 2];
          this.upload3DImageStatus = 'uploaded';
        },
        error => {
          this.toster.error(error.error.message)
        }
      )
      // }
    }
    if (type == 'jpg') {
      this.store_jpg_file_name = this.fileToUpload.name;
      this.upload2DImageStatus = 'uploading';
      // if(this.fileToUpload.size <= 2000000)
      // {
      this.storeservice.uploadJpgImage(this.fileToUpload).subscribe(
        (res) => {
          this.store_jpg_file = res['data'].fileUrl;
          const url = this.store_jpg_file
          const parts = url.split('/');
          const lastPart = parts[parts.length - 1];
          const fullstorename = lastPart.split('.');
          this.storeslug = fullstorename[fullstorename.length - 2];
          this.upload2DImageStatus = 'uploaded';
        },
        error => {
          this.toster.error(error.error.message)
        }
      )
      // }
    }
    if (type == 'logo') {
      this.logo_file_name = this.fileToUpload.name;
      this.uploadLogoStatus = 'uploading';
      const fileExtension = this.logo_file_name.split('.').pop(); // Get the file extension
      // if(this.fileToUpload.size <= 2000000)
      // {
      this.storeservice.uploadLogoImage(this.fileToUpload).subscribe(
        (res) => {
          this.logo_file = res['data'].fileUrl;
          this.uploadLogoStatus = 'uploaded';
        },
        error => {
          this.toster.error('Only PNG OR JPG File is allowed')
        }
      )
      // }
    }




  }

  uploadOnChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    this.store_json_file_name = file.name;
    const fileExtension: string = this.store_json_file_name.split('.').pop();
    console.log('fileExtension ================', fileExtension);
    if (fileExtension == 'json') {
      reader.onload = (e: any) => {
        const contents = e.target.result;
        this.storeProductJson = JSON.parse(contents);
      };
      reader.readAsText(file);
      this.invalidForm = false;
    } else {
      this.toster.error('Only JSON File is allowed');
      this.invalidForm = true;
    }
  }

  onStoreEdit() {

    let formData = this.storeSubmitForm.value;

    if (this.userrole == 'vendor') {

      if (formData.store_desc) {
        if (this.storeProductJson.length > 0) {
          this.updatejson =
          {
            'store_id': this.route.snapshot.paramMap.get('id'),
            "store_name": formData.store_name,
            "store_location": formData.store_location,
            "domain_name": formData.domain_name,
            "store_description": formData.store_desc,
            "store_jpg_file": this.store_jpg_file,
            "store_jpg_file_name": this.store_jpg_file_name,
            "store_glb_file": this.store_glb_file,
            "store_glb_file_name": this.store_glb_file_name,
            "store_json_file_name": this.store_json_file_name,
            "store_products": this.storeProductJson,
            "logo": this.logo_file,
            "logo_file_name": this.logo_file_name,
            "logo_name": formData.logo_name,
            "is_logo": this.logo_status
          }
        }
        else {
          this.updatejson =
          {
            'store_id': this.route.snapshot.paramMap.get('id'),
            "store_name": formData.store_name,
            "store_location": formData.store_location,
            "domain_name": formData.domain_name,
            "store_description": formData.store_desc,
            "store_jpg_file": this.store_jpg_file,
            "store_jpg_file_name": this.store_jpg_file_name,
            "store_glb_file": this.store_glb_file,
            "store_glb_file_name": this.store_glb_file_name,
            "logo": this.logo_file,
            "logo_file_name": this.logo_file_name,
            "logo_name": formData.logo_name,
            "is_logo": this.logo_status
          }
        }

      }
      else {
        if (this.storeProductJson.length > 0) {
          this.updatejson =
          {
            'store_id': this.route.snapshot.paramMap.get('id'),
            "store_name": formData.store_name,
            "store_location": formData.store_location,
            "domain_name": formData.domain_name,
            "store_jpg_file": this.store_jpg_file,
            "store_jpg_file_name": this.store_jpg_file_name,
            "store_glb_file": this.store_glb_file,
            "store_glb_file_name": this.store_glb_file_name,
            "store_json_file_name": this.store_json_file_name,
            "store_products": this.storeProductJson,
            "logo": this.logo_file,
            "logo_file_name": this.logo_file_name,
            "logo_name": formData.logo_name,
            "is_logo": this.logo_status
          }
        }
        else {
          this.updatejson =
          {
            'store_id': this.route.snapshot.paramMap.get('id'),
            "store_name": formData.store_name,
            "store_location": formData.store_location,
            "domain_name": formData.domain_name,
            "store_jpg_file": this.store_jpg_file,
            "store_jpg_file_name": this.store_jpg_file_name,
            "store_glb_file": this.store_glb_file,
            "store_glb_file_name": this.store_glb_file_name,
            "logo": this.logo_file,
            "logo_file_name": this.logo_file_name,
            "logo_name": formData.logo_name,
            "is_logo": this.logo_status
          }
        }
      }
      console.log('this.updatejson', this.updatejson)
      this.storeservice.singleStoreUpdate(this.updatejson).subscribe(
        res => {

          // console.log('Store Updated',res);  
          this.storeinsertMessage = "Store Updated successfully";
          this.storeinsertValid = true;
          this.router.navigate(['/stores/list-store']);

        },

        error => {
          // .... HANDLE ERROR HERE 
          // console.log(error.message);
          this.toster.error(error.error.message)
        }
      );

    }

    if (this.userrole == 'admin') {
      if (this.storeProductJson.length > 0) {
        this.updatejson =
        {
          "store_owner_id": this.vendor_id,
          'store_id': this.route.snapshot.paramMap.get('id'),
          "store_name": formData.store_name,
          "store_location": formData.store_location,
          "domain_name": formData.domain_name,
          "store_jpg_file": this.store_jpg_file,
          "store_jpg_file_name": this.store_jpg_file_name,
          "store_glb_file": this.store_glb_file,
          "store_glb_file_name": this.store_glb_file_name,
          "store_json_file_name": this.store_json_file_name,
          "store_products": this.storeProductJson,
          "logo": this.logo_file,
          "logo_file_name": this.logo_file_name,
          "logo_name": formData.logo_name,
          "is_logo": this.logo_status
        }
      }
      else {
        this.updatejson =
        {
          "store_owner_id": this.vendor_id,
          'store_id': this.route.snapshot.paramMap.get('id'),
          "store_name": formData.store_name,
          "store_location": formData.store_location,
          "domain_name": formData.domain_name,
          "store_jpg_file": this.store_jpg_file,
          "store_jpg_file_name": this.store_jpg_file_name,
          "store_glb_file": this.store_glb_file,
          "store_glb_file_name": this.store_glb_file_name
        }
      }
      console.log('this.updatejson', this.updatejson)
      this.storeservice.singleStoreUpdateAdmin(this.updatejson).subscribe(
        res => {

          // console.log('Store Updated',res);  
          this.storeinsertMessage = "Store Updated successfully";
          this.storeinsertValid = true;
          this.router.navigate(['/stores/list-store']);
        },
        error => {
          // .... HANDLE ERROR HERE 
          // console.log(error.message);
          this.toster.error(error.error.message)
        }
      );

    }

    // console.log('Store Submitted JSON',this.updatejson);



    // console.log('Store Submitted');
  }


  handleEnter(event: KeyboardEvent, nextElementId?: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (nextElementId) {
        const nextElement = document.getElementById(nextElementId);
        if (nextElement) {
          nextElement.focus();
        }
      } else {
        // If no next element id is provided, submit the form
        this.onStoreEdit();
      }
    }
  }

  addNewRoom() {
    let newRoomObj =
    {
      store_slug: this.store_slug
    }

    this.storeservice.addNewRoomInStore(newRoomObj).subscribe(
      res => {
        this.desableaddRooom = true;
        this.toster.success('New Room Added')
      },
      error => {
        // .... HANDLE ERROR HERE 
        this.toster.error(error.error.message)
      }
    )

  }

  logoStatusChange(event: any) {
    this.logo_status = !this.logo_status;
  }


}
