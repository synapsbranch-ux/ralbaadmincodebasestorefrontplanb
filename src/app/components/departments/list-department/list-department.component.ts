import { MatDialog } from '@angular/material/dialog';
import { DepartmentStatusChangeComponent } from './../department-status-change/department-status-change.component';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../department.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department',
  templateUrl: './list-department.component.html',
  styleUrls: ['./list-department.component.scss']
})
export class ListDepartmentComponent implements OnInit {

  departmentList=[];
  departmentavailable:boolean=false;
  
  userrole:any;
  isAdmin:boolean =false;
  department_status_name:any
  delete_department_id:any;

  constructor( private router: Router, private departmentservice: DepartmentService, private route: ActivatedRoute, private dialog: MatDialog, private toastrService:ToastrService) {

  }

  @ViewChild('departmentDelete', { static: true })
  departmentDelete!: TemplateRef<any>;

  @ViewChild('table')
  smartTable: any;

  public settings = {
    // hideSubHeader: true,
    columns: {
      department_image:{
        title: 'Department Image',
        type:'html',
        valuePrepareFunction: (value) =>
        { return '<img width="100px" class="product_image" src= ' + value + '  />' },
      },
      department_name: {
        title: 'Department Title'
      },
      department_store: {
        title: 'Store Name',

        valuePrepareFunction: (value) =>
        {
          return value['store_name'] },
      },
      button: {
        title: 'Status',
        type: 'custom',
        renderComponent: DepartmentStatusChangeComponent,
      },
    },     

    actions: {
      columnTitle: 'Actions',
      add: false,
      delete: true,
      position: 'right'
    },

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    mode: 'external',
  };


ngOnInit() {

  this.userrole=localStorage.getItem("user_role");
if(this.userrole == 'admin'){
  this.isAdmin=true;
}
  this.allDepartmentList();

}


ngAfterViewInit(): void {

  this.smartTable.edit.subscribe( (dataObject: any) => {
    this.router.navigate(['/departments/edit-department/'+dataObject["data"]._id]);
  });

  this.smartTable.delete.subscribe( (dataObject: any) => {
    this.delete_department_id=dataObject["data"]._id;
    this.dialog.open(this.departmentDelete,{ disableClose: false });
  });

}

deleteConfirm()
{
       
      let department=
      {
        "department_id": this.delete_department_id
      }
    
      if(this.userrole == 'vendor')
      {
      this.departmentservice.singleDepartmentDelete(department).subscribe(
        res =>
        {
          this.departmentservice.allDepartment().subscribe(
            res =>{
              this.departmentList=res['data'];
              if(this.departmentList.length > 0)
              {
                this.departmentavailable=true;
              }
              else
              {
                this.departmentavailable=false;
              }
              // console.log('List Of Department API ==== ',res);
            },
            error => {
              this.toastrService.error(error.error.message)
          }
          )
          this.allDepartmentList();
          // console.log('Store Deleted', res);
        }
      )
      }
      if(this.userrole == 'admin')
      {
        this.departmentservice.singleDepartmentDeleteAdmin(department).subscribe(
          res =>
          {
            this.departmentservice.allDepartment().subscribe(
              res =>{
                this.departmentList=res['data'];
                if(this.departmentList.length > 0)
                {
                  this.departmentavailable=true;
                }
                else
                {
                  this.departmentavailable=false;
                }
    
    
                // console.log('List Of Department API ==== ',res);
              },
              error => {
                this.toastrService.error(error.error.message)
            }
            )
            this.allDepartmentList();
            // console.log('Store Deleted', res);
          }
        )
    
      }

}

allDepartmentList()
{
    /////  Vendor All Department   ///////

if(this.userrole == 'vendor')
{
  this.departmentservice.allDepartment().subscribe(
    res =>{
      this.departmentList=res['data'];
      if(this.departmentList.length > 0)
      {
        this.departmentavailable=true;
      }
      else
      {
        this.departmentavailable=false;
      }
      // console.log('List Of Department API ==== ',res);
    },
    error => {
      this.toastrService.error(error.error.message)
  }
  
  )
}

/////  Admin All Store   /////////

if(this.userrole == 'admin')
{

  this.departmentservice.allDepartmentAdmin().subscribe(
    res =>{
      this.departmentList=res['data'];
      if(this.departmentList.length > 0)
      {
        this.departmentavailable=true;
      }
      else
      {
        this.departmentavailable=false;
      }
      // console.log('List Of Department API ==== ',res);
    },
    error => {
      this.toastrService.error(error.error.message)
  }
  )

}

}


}
