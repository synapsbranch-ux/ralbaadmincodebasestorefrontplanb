import { DepartmentService } from './../department.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'department-status-change',
  templateUrl: './department-status-change.component.html',
  styleUrls: ['./department-status-change.component.scss']
})
export class DepartmentStatusChangeComponent implements  OnInit {
  renderValue: string;
  renderValueopp:string;
  editBtnColor: string;
  userrole:any;
  isAdmin:boolean =false;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor( private departmentservice: DepartmentService, private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {

    this.userrole=localStorage.getItem("user_role");
    if(this.userrole == 'admin'){
      this.isAdmin=true;
    }

    this.renderValue = this.rowData.status;
    if(this.rowData.status == 'active'){  
        this.renderValue='active';
        this.renderValueopp='Pending';
    }
    else
    {
        this.renderValue='pending';
        this.renderValueopp='Active'
    }
  }

  statusChange()
  {
    let vendor_id=localStorage.getItem('current-vendor')
    if(this.renderValue == 'active')
    {
      this.renderValue= "pending"; 
      this.renderValueopp='Active'
    }
    else
    {
      this.renderValue="active";
      this.renderValueopp='Pending';
    }
      let jsondata=
      {
        "department_id": this.rowData._id,
        "status" : this.renderValue
    
      }
        this.departmentservice.singleDepartmentStatuschange(jsondata).subscribe(
          res => {
            this.toastr.success('Department Updated','Success' );
            this.router.navigateByUrl('/vendors/create-vendors', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/vendors/vendor-department-list/'+vendor_id]);
            });
            if(res.data.status == 'active'){  
                this.renderValue='active';
            }
            else
            {
                this.renderValue='pending';
            }
            console.log('AS Status',res);  
          },
          error => {
            this.toastr.error(error.error.message)
        }
        ); 
  
  
  }
}