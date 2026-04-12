import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DepartmentService } from '../department.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss']
})
export class EditDepartmentComponent implements OnInit {
  storeLists=[]
  elementList=[]
  uploadDepartmentImages:any;
  uploadDepartmentImagesName:any
  departrmentinsertValid: boolean = false;
  departrmentinsertMessage:any
  departrmentinsertimgValid: boolean = false;

  departmentname:any;
  storename:any;
  elementname:any;

  userrole:any;
  isAdmin:boolean =false;

  closeResult = '';


  public departmentSubmitForm: FormGroup;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public departmentservice: DepartmentService, private route: ActivatedRoute, private router : Router, private toster: ToastrService) { 
  }

   

ngOnInit() {
  this.userrole=localStorage.getItem("user_role");
  if(this.userrole == 'admin'){
    this.isAdmin=true;
  }


  this.departmentSubmitForm = new FormGroup({
    'department_name': new FormControl(null, [Validators.required]),
    'store_name': new FormControl(null, [Validators.required]),
    'element_name': new FormControl(null, [Validators.required]),
  });

  if(this.userrole == 'vendor')
  {

  let department_id=
  {
    "department_id": this.route.snapshot.paramMap.get('id')
  }
 
  this.departmentservice.singleDepartmentDetails(department_id).subscribe(
    res =>
    {
      this.departmentname=res['data'].department_name;
      this.storename=res['data'].department_store._id;
      this.elementname=res['data'].department_room._id;
      this.uploadDepartmentImages=res['data'].department_image;
      this.uploadDepartmentImagesName=res['data'].department_image_name;
      // console.log('Single Department Details =====',res['data'])

    },
    error => {
      this.toster.error(error.error.message)
  }
    );

  let data={ "page": 1, "limit" : 20}
  this.departmentservice.allStorelist(data).subscribe(
      res =>{
        this.storeLists=res['data'];
        // console.log('All storeLists List API ======',res);
      },
      error => {
        this.toster.error(error.error.message)
    }
    )

    this.departmentservice.allelementlist().subscribe(
      res =>{
        this.elementList=res['data'].map( (elem) =>
        {
          if(elem.roomelement_name == 'Table')
          {
            elem.roomelement_name= elem.roomelement_name+' (Bags)'
          }
          if(elem.roomelement_name == 'Shelf')
          {
            elem.roomelement_name= elem.roomelement_name+' (Shoes)'
          }
          if(elem.roomelement_name == 'Rack')
          {
            elem.roomelement_name= elem.roomelement_name+' (Apparels)'
          }
          return elem

        });
        // console.log('All elementList List API ======',res);
      },
      error => {
        this.toster.error(error.error.message)
    }
    )
    }


    if(this.userrole == 'admin')
    {
  
    let department_id=
    {
      "department_id": this.route.snapshot.paramMap.get('id')
    }
   
    this.departmentservice.singleDepartmentDetailsAdmin(department_id).subscribe(
      res =>
      {
        this.departmentname=res['data'].department_name;
        this.storename=res['data'].department_store._id;
        this.elementname=res['data'].department_room._id;
        this.uploadDepartmentImages=res['data'].department_image;
        // console.log('Single Department Details =====',res['data'])
  
      },
      error => {
        this.toster.error(error.error.message)
    }
    );
  
    let data={ "page": 1, "limit" : 20}
    this.departmentservice.allStorelistAdmin(data).subscribe(
        res =>{
          this.storeLists=res['data'];
          // console.log('All storeLists List API ======',res);
        },
        error => {
          this.toster.error(error.error.message)
      }
      )
  
      this.departmentservice.allelementlistAdmin().subscribe(
        res =>{
          this.elementList=res['data'].map( (elem) =>
          {
            if(elem.roomelement_name == 'Table')
            {
              elem.roomelement_name= elem.roomelement_name+' (Bags)'
            }
            if(elem.roomelement_name == 'Shelf')
            {
              elem.roomelement_name= elem.roomelement_name+' (Shoes)'
            }
            if(elem.roomelement_name == 'Rack')
            {
              elem.roomelement_name= elem.roomelement_name+' (Apparels)'
            }
            return elem

          });
          // console.log('All elementList List API ======',res);
        },
        error => {
          this.toster.error(error.error.message)
      }
      )
      }

}


    // Create Room
    get department_name() { return this.departmentSubmitForm.get('department_name').value; }
    get store_name() { return this.departmentSubmitForm.get('store_name').value; }
    get element_name() { return this.departmentSubmitForm.get('element_name').value; }


onDepartmentEdit()
{
    let formData = this.departmentSubmitForm.value;

    let  jsondata = 
  {
    "department_id": this.route.snapshot.paramMap.get('id'),
    "department_name": formData.department_name,
    "department_image": this.uploadDepartmentImages,
    "department_image_name": this.uploadDepartmentImagesName,
    "department_store": formData.store_name,
    "department_roomelement": formData.element_name
    }


if(this.uploadDepartmentImages )
{

if(this.userrole == 'vendor')
{

this.departmentservice.singleDepartmentUpdate(jsondata).subscribe(
  res => {

    // console.log('Department Updated',res);  
    this.departrmentinsertMessage="Department Updated successfully";
    this.departrmentinsertValid = true;
    setTimeout(() => {
      this.router.navigate(['/departments/list-department']);
    },10) 
  },
  error => {
    this.toster.error(error.error.message)
}
);  
}
if(this.userrole == 'admin')
{
  this.departmentservice.singleDepartmentUpdateAdmin(jsondata).subscribe(
    res => {
  
      // console.log('Department Updated',res);  
      this.departrmentinsertMessage="Department Updated successfully";
      this.departrmentinsertValid = true;
      setTimeout(() => {
        this.router.navigate(['/departments/list-department']);
      },10) 
    },
    error => {
      this.toster.error(error.error.message)
  }
  );  
}

}
else
{
  this.departrmentinsertMessage="Image Upload Failed. Please Check Image Upload Guideline";
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
};


public onUploadError(args: any): void { 
  // console.log('onUploadError:', args);
}

public onUploadSuccess(args: any): void {
  // console.log('onUploadSuccess:', args);
  if(args[1].error == 0)
  {
  // if(args[0].width == 400 && args[0].height == 400 && args[0].upload.total <= 5000000)
  // {
    let image_link=args[1].data.fileUrl
    let image_name = args[1].data.image_name.replace('department/','');
    this.uploadDepartmentImages=image_link;
    this.uploadDepartmentImagesName=image_name;
  //  }
  // else
  // {
  //   this.onDelete(args[0]);
  // }

  }
}

public onDelete(args: any): void { 
  // console.log('Delte Department Image',args)
}

 open(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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

deleteDepaartmentImage(depimg:any)
{
  let dpimgData={
    department_image_name: depimg
  }

  this.departmentservice.departmentImageDelete(dpimgData).subscribe(
  res =>
  {
  this.toster.success('Department image Deleted')
  // console.log('Delte Department Image',res)
  this.uploadDepartmentImages= "";
  this.uploadDepartmentImagesName="";
  },
  error => {
    this.toster.error(error.error.message)
}
  )

}


onFileAdded(file: File) {
    // console.log('File added manually:', file);

    this.departmentservice.uploadImage(file).subscribe({
      next: (res) => {
        this.onUploadSuccess([file, res]); 
      },
      error: (err) => {
        console.error('Manual upload error', err);
      }
    });
  }



}
