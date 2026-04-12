
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SubAdminService } from '../sub-admin.service';


@Component({
  selector: 'sub-admin-status-change',
  templateUrl: './sub-admin-status-change.component.html',
  styleUrls: ['./sub-admin-status-change.component.scss']
})
export class SubAdminStatusChangeComponent implements  OnInit {
  renderValue: string;
  renderValueopp:string;
  editBtnColor: string;
  userrole:any;
  isAdmin:boolean =false;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor( private subadminservice: SubAdminService, private router: Router, private toastr : ToastrService) {

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
        "subadmin_id": this.rowData._id,
        "status" : this.renderValue
    
      }
        this.subadminservice.singleSubadminUpdateAdmin(jsondata).subscribe(
          res => {
            this.toastr.success('Subadmin Updated','Success' );
            if(res.data.status == 'active'){  
                this.renderValue='active';
            }
            else
            {
                this.renderValue='pending';
            }
            // console.log('AS Status',res);  
          },
          error => {
            this.toastr.error(error.error.message)
        }
        ); 
  }

  moduleAccessChange()
  {
    this.router.navigate(['/subadmin/module-access/'+this.rowData._id]);
  }
}