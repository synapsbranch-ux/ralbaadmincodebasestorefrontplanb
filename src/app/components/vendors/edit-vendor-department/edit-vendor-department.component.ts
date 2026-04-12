import { VendorsService } from './../vendor.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-vendor-department',
  templateUrl: './edit-vendor-department.component.html',
  styleUrls: ['./edit-vendor-department.component.scss']
})
export class EditVendorDepartmentComponent implements OnInit {
  storeLists = []
  elementList = []
  uploadDepartmentImages: any;

  departrmentinsertValid: boolean = false;
  departrmentinsertMessage: any
  departrmentinsertimgValid: boolean = false;

  departmentname: any;
  storename: any;
  elementname: any;
  vendor_id: any;

  userrole: any;
  isAdmin: boolean = false;

  closeResult = '';


  public departmentSubmitForm: FormGroup;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private vendorsService: VendorsService, private route: ActivatedRoute, private router: Router, private ngZone: NgZone) {
  }



  ngOnInit() {
    this.vendor_id = localStorage.getItem('vendor-id');
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }


    this.departmentSubmitForm = new FormGroup({
      'department_name': new FormControl(null, [Validators.required]),
      'store_name': new FormControl(null, [Validators.required]),
      'element_name': new FormControl(null, [Validators.required]),
    });


    if (this.userrole == 'admin') {

      let department_id =
      {
        "department_id": this.route.snapshot.paramMap.get('id')
      }

      this.vendorsService.singleDepartmentDetailsAdmin(department_id).subscribe(
        res => {
          this.departmentname = res['data'].department_name;
          this.storename = res['data'].department_store._id;
          this.elementname = res['data'].department_room._id;
          this.uploadDepartmentImages = res['data'].department_image;
          // console.log('Single Department Details =====',res['data'])

        });

      let data = { "vendor_id": this.vendor_id, "page": 1, "limit": 20 }
      this.vendorsService.allStorelistVendorAdmin(data).subscribe(
        res => {
          this.storeLists = res['data'];
          // console.log('All storeLists List API ======',res);
        }
      )

      this.vendorsService.allelementlistAdmin().subscribe(
        res => {
          this.elementList = res['data'];
          // console.log('All elementList List API ======',res);
        }
      )
    }

  }


  // Create Room
  get department_name() { return this.departmentSubmitForm.get('department_name').value; }
  get store_name() { return this.departmentSubmitForm.get('store_name').value; }
  get element_name() { return this.departmentSubmitForm.get('element_name').value; }


  onDepartmentEdit() {
    let formData = this.departmentSubmitForm.value;

    let jsondata =
    {
      "department_id": this.route.snapshot.paramMap.get('id'),
      "department_name": formData.department_name,
      "department_image": this.uploadDepartmentImages,
      "department_store": formData.store_name,
      "department_roomelement": formData.element_name
    }


    if (this.uploadDepartmentImages) {

      if (this.userrole == 'admin') {
        this.vendorsService.singleDepartmentUpdateAdmin(jsondata).subscribe(
          res => {

            // console.log('Department Updated',res);  
            this.departrmentinsertMessage = "Department Updated successfully";
            this.departrmentinsertValid = true;

            /// settimeout Start
            const startTime = performance.now();
            this.ngZone.runOutsideAngular(() => {
              const checkTime = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime >= 2000) {
                  this.ngZone.run(() => {
                    this.router.navigate(['/vendors/vendor-department-list/' + this.vendor_id]);
                  });
                } else {
                  requestAnimationFrame(checkTime);
                }
              };
              requestAnimationFrame(checkTime);
            });
            /// settimeout End


          },
          error => {
            // .... HANDLE ERROR HERE 
            // console.log(error.message);
          }
        );
      }

    }
    else {
      this.departrmentinsertMessage = "Image Upload Failed. Please Check Image Upload Guideline";
      this.departrmentinsertimgValid = true;
    }
    // console.log(jsondata);



    // console.log('Department Submitted');
  }




  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    accept: (file, done) => {
      this.onAccept(file, done);
    },

  };


  onAccept(ev: any, done: Function) {

    if (ev) {
      // console.log('Uplad File', ev)
      const file = ev;
      const img = new Image();
      img.onload = () => {
        // console.log('Current Width',img.width)
        // console.log('Current Height',img.height)

        //   // total: 2256862
        //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
        //   // {
        this.vendorsService.uploadImage(file).subscribe(
          (res) => {
            // console.log('Image Upload Sucess',res);
            this.uploadDepartmentImages = res['data'].fileUrl;
          },
          (err) => {
            // console.log('Image Upload Error',err);
          })
        //   // }

      };
      img.src = URL.createObjectURL(file);
      // console.log('Iamge Type', ev.type);


    }

  }

  public onUploadError(args: any): void {
    // console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    //  // console.log('onUploadSuccess:', args);
    //  if(args[1].error == 0)
    //  {
    //   this.uploadDepartmentImages=args[1].data.fileUrl
    //  }
    //  else{
    //   // localStorage.clear();
    //   // this.router.navigate(['auth/vendor-login']);
    //  }

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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



}
