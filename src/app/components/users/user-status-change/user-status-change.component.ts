import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../user.service';


@Component({
  selector: 'user-status-change',
  templateUrl: './user-status-change.component.html',
  styleUrls: ['./user-status-change.component.scss']
})
export class UserStatusChangeComponent implements  OnInit {
  renderValue: string;
  editBtnColor: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor( private userservice: UsersService, private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {
    this.renderValue = this.rowData.status;
    if(this.rowData.status == 'active'){  
        this.renderValue='active';
    }
    else
    {
        this.renderValue='inactive';
    }
  }

  onClick() {

      if(this.renderValue == 'active')
      {
        this.renderValue= "inactive"; 
      }
      else
      {
        this.renderValue="active";
      }
        let jsondata=
        {
          "user_id": this.rowData._id,
          "status" : this.renderValue
      
        }
          this.userservice.userStatuschange(jsondata).subscribe(
            res => {
                this.toastr.success('User Status Updated','Success' );
                if(res.data.status == 'active'){  
                    this.renderValue='active';
                }
                else
                {
                    this.renderValue='inactive';
                }
                // console.log('AS Status',this.renderValue);
            },
            error => {
              this.toastr.error(error.error.message)
          }
          ); 
  }
}