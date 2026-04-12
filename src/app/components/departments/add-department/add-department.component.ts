import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../department.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {
    storeLists=[]
    elementList=[]
    uploadDepartmentImages:any;
    uploadDepartmentImagesName:any;
    departrmentinsertValid: boolean = false;
    departrmentinsertMessage:any
    departrmentinsertimgValid: boolean = false;


    public departmentSubmitForm: FormGroup;
    closeResult = '';

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public departmentservice: DepartmentService, private router : Router,private toastrService: ToastrService) { 
this.createDepartment();
  }

   

ngOnInit() {

  this.departmentSubmitForm = new FormGroup({
    'department_name': new FormControl(null, [Validators.required]),
    'store_name': new FormControl(null, [Validators.required]),
    'element_name': new FormControl(null, [Validators.required]),
  });
let data={ "page": 1, "limit" : 20}
    this.departmentservice.allStorelist(data).subscribe(
        res =>{
          this.storeLists=res['data'];
          // console.log('All storeLists List API ======',res);
        },
        error => {
          this.toastrService.error(error.error.message)
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


          // console.log('All elementList List API ======',this.elementList);
        },
        error => {
          this.toastrService.error(error.error.message)
      }
      )

}

createDepartment() {
    this.departmentSubmitForm = this.formBuilder.group({
      department_name: [''],
      store_name: [''],
      element_name: ['']
    })
  }

      // Create Room
      get department_name() { return this.departmentSubmitForm.get('department_name').value; }
      get store_name() { return this.departmentSubmitForm.get('store_name').value; }
      get element_name() { return this.departmentSubmitForm.get('element_name').value; }

onDepartmentSubmit()
{
    let formData = this.departmentSubmitForm.value;

    if (this.departmentSubmitForm.invalid) {
      return;
    }

    let jsondata = 
    {
      "department_name": formData.department_name,
      "department_store": formData.store_name,
      "department_roomelement": formData.element_name,
      "department_image":this.uploadDepartmentImages,
      "department_image_name":this.uploadDepartmentImagesName
  }

      // console.log(jsondata);

      if(this.uploadDepartmentImages)
    {
      this.departmentservice.addDepartment(jsondata).subscribe(
        res => {

          // console.log('Department Added',res);  
          
          this.departrmentinsertMessage="Department Added successfully";
          this.departrmentinsertValid = true;
          setTimeout(() => {
            this.router.navigate(['/departments/list-department']);
          },10)
        },
        error => {
          this.toastrService.error(error.error.message)
      }
      );
    }
    else
    {
      this.departrmentinsertMessage="Image Upload Failed. Please Check Image Upload Guideline";
      this.departrmentinsertimgValid = true;
    }      
}

public config: DropzoneConfigInterface = {
  clickable: true,
  maxFiles: 1,
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

     // console.log('Department image link',this.uploadDepartmentImages);
     // console.log('Department image name',this.uploadDepartmentImagesName);
   //  }
   // else
   // {
   //   this.onDelete(args[0]);
   // }
 
   }
 }

 public onDelete(args: any): void { 
  // console.log('Delte Department Image',args)
  // if(args.upload.filename != "")
  // {
  //   let dpimgData={
  //     department_image_name: this.uploadDepartmentImagesName
  //   }
  
  //   this.departmentservice.departmentImageDelete(dpimgData).subscribe(
  //   res =>
  //   {
  //   // console.log('Delte Department Image',res)
  //   this.uploadDepartmentImages= "";
  //   this.uploadDepartmentImagesName="";
  //   }
  //   )
  // }

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
