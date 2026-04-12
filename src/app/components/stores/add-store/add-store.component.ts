import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';
import '@google/model-viewer';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../products/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [  // :enter is alias for void => *
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [  // :leave is alias for * => void
        animate('300ms', style({ opacity: 0 })),
      ]),
    ])
  ]
})



export class AddStoreComponent implements OnInit {
  @ViewChild('vendorsModel', { static: true })
  vendorsModel!: TemplateRef<any>;
  private dialogRef: MatDialogRef<any> | null = null;

  userrole: any;
  isAdmin: boolean = false;
  storeinsertValid: boolean = false;
  storeinsertinValid: boolean = false;
  storeinsertMessage: any
  storenotavailable: boolean = false;
  uploadfrom: string = 'store';
  public storeSubmitForm: FormGroup;
  public storeRequestSubmitForm: FormGroup;
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
  uploadLogoStatus: string = '';
  storeProductJson: any;
  storename: any
  store_json_file_name: any;
  invalidForm: boolean = false;
  logo_status: boolean = false;
  logo_file_name: any
  logo_file: any
  copyVendorLists = [];
  copy_status: boolean = false;
  hide_status: boolean = false;
  selectvendor = "1";
  current_vendor_id: any;
  current_vendor_name: any;
  totalVendors = 0;
  pageSize = 5;
  currentPage = 0;
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private modalService: NgbModal, private productservice: ProductService, private dialog: MatDialog, public storeservice: StoreService, private router: Router, private toastrService: ToastrService) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

    // console.log(localStorage.getItem('user_token'));
    this.storeSubmitForm = new FormGroup({
      'store_name': new FormControl(null),
      'store_location': new FormControl(null),
      'domain_name': new FormControl(null),
      'store_desc': new FormControl(null),
      'logo_name': new FormControl(null),
      'vendor_id': new FormControl(null),
    });

    this.storeRequestSubmitForm = new FormGroup({

    });

    let storelist =
    {
      'page': '1',
      'limit': '10'
    }

    /////  Vendor All Store   ///////

    if (this.userrole == 'vendor') {
      this.storeservice.allStorelist(storelist).subscribe(
        res => {
          if (res['data'].length > 0) {
            this.storenotavailable = false;
            this.toastrService.error('You have already a Store');
            // this.router.navigate(['/stores/list-store']);
          }
          else {
            this.storenotavailable = true;
          }
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }

    this.copyVendorList(this.currentPage, this.pageSize);
  }

  copyVendorList(page: number, pageSize: number) {
    this.productservice.allCopyVendorList(page + 1, pageSize).subscribe(
      res => {
        this.copyVendorLists = res['data'].vendorList;
        this.dataSource.data = res['data'].vendorList;
        this.totalVendors = res['data'].totalVendors;  // Total number of data from API
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    )
  }

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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    this.copyVendorList(this.currentPage, this.pageSize);
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
      const fileExtension = this.store_glb_file_name.split('.').pop(); // Get the file extension
      // if(this.fileToUpload.size <= 2000000)
      // {
      this.storeservice.uploadImage(this.fileToUpload).subscribe(
        (res) => {
          this.store_glb_file = res['data'].fileUrl;
          const url = this.store_glb_file
          const parts = url.split('/');
          const lastPart = parts[parts.length - 1];
          const fullstorename = lastPart.split('.');
          this.storename = fullstorename[fullstorename.length - 2];
          this.upload3DImageStatus = 'uploaded';
        },
        error => {
          this.toastrService.error('Only GLB File is allowed')
        }
      )
      // }
    }
    if (type == 'jpg') {
      this.store_jpg_file_name = this.fileToUpload.name;
      this.upload2DImageStatus = 'uploading';
      const fileExtension = this.store_jpg_file_name.split('.').pop(); // Get the file extension
      // if(this.fileToUpload.size <= 2000000)
      // {
      this.storeservice.uploadJpgImage(this.fileToUpload).subscribe(
        (res) => {
          this.store_jpg_file = res['data'].fileUrl;
          const url = this.store_jpg_file
          const parts = url.split('/');
          const lastPart = parts[parts.length - 1];
          const fullstorename = lastPart.split('.');
          this.storename = fullstorename[fullstorename.length - 2];
          this.upload2DImageStatus = 'uploaded';
        },
        error => {
          this.toastrService.error('Only JPG File is allowed')
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
          this.toastrService.error('Only PNG OR JPG File is allowed')
        }
      )
      // }
    }


  }

  viewStore(store: any) {
    window.open(`https://ralbatech.com/vendor/${store.store_slug}`, '_blank');
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
      this.toastrService.error('Only JSON File is allowed');
      this.invalidForm = true;
    }
  }
  // Create Room
  get store_name() { return this.storeSubmitForm.get('store_name') }
  get store_location() { return this.storeSubmitForm.get('store_location') }
  get domain_name() { return this.storeSubmitForm.get('domain_name') }
  get store_desc() { return this.storeSubmitForm.get('store_desc') }
  get logo_name() { return this.storeSubmitForm.get('logo_name') }
  get vendor_id() { return this.storeSubmitForm.get('vendor_id').value; }

  onStoreSubmit() {
    let formData = this.storeSubmitForm.value;
    console.log('this.storenotavailable', this.storenotavailable);
    if (this.storenotavailable) {
      console.log('this.copy_status', this.copy_status);
      if (!this.copy_status && (!formData.store_name || !formData.store_location)) {
        this.toastrService.error('Please choose the copy section or provide both Store Name and Store Location.');
        return;
      }
      let jsondata = {};
      let store_department = ""
      if (formData.store_desc) {
        store_department = formData.store_desc;
      }
      else {
        store_department = "";
      }

      jsondata =
      {
        'is_copy': this.copy_status ? true : false,
        'main_vendor_id': this.current_vendor_id ? this.current_vendor_id : '',
        "store_name": formData.store_name ? formData.store_name : '',
        "store_location": formData.store_location,
        "domain_name": formData.domain_name,
        "store_description": store_department,
        "store_jpg_file": this.store_jpg_file,
        "store_jpg_file_name": this.store_jpg_file_name,
        "store_glb_file": this.store_glb_file,
        "store_glb_file_name": this.store_glb_file_name,
        "store_json_file_name": this.store_json_file_name,
        "store_products": this.storeProductJson,
        "logo": this.logo_file,
        "logo_name": formData.logo_name,
        "logo_file_name": this.logo_file_name,
        "is_logo": this.logo_status
      }
      this.storeservice.addStores(jsondata).subscribe(
        res => {

          console.log('Store Addes', res['data'].token);
          if (this.copy_status) {
            localStorage.setItem("vendor_type", 'access')
            localStorage.setItem("user_token", res['data'].token)
          }
          this.storeinsertMessage = "Store Added successfully";
          this.storeinsertValid = true;
          this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/stores/list-store']);
          });
        },
        error => {
          // .... HANDLE ERROR HERE 
          console.log(error);
          this.toastrService.error(error.error.message)
        }
      );
    }
    else {
      this.storeinsertMessage = "You have already a Store";
      this.storeinsertValid = false;
      this.storeinsertinValid = true;
    }

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
        this.onStoreSubmit();
      }
    }
  }

  logoStatusChange(event: any) {
    this.logo_status = !this.logo_status;
  }

  selectVendor(vendor: any) {
    this.hide_status = !this.hide_status;
    // If the currently selected vendor is the same as the clicked one, deselect it by setting `current_vendor_id` to null
    if (this.current_vendor_id === vendor._id) {
      this.current_vendor_id = null;  // Deselect the vendor
      this.current_vendor_name=""
    } else {
      // Otherwise, select the new vendor
      this.current_vendor_id = vendor._id;
      this.current_vendor_name=vendor.name
    }

    // this.dialogRef.close();
  }

  copyStatusChange(event: any) {

    this.copy_status = !this.copy_status;
    this.hide_status = false;
    // if (this.copy_status) {
    //   this.dialogRef = this.dialog.open(this.vendorsModel, { disableClose: true });
    // }
    if (this.copy_status) {
      // Disable the form controls if copy_status is true
      this.storeSubmitForm.get('store_location').disable();
      this.storeSubmitForm.get('store_desc').disable();
    } else {
      // Enable the form controls if copy_status is false
      this.storeSubmitForm.get('store_location').enable();
      this.storeSubmitForm.get('store_desc').enable();
    }
  }


}
