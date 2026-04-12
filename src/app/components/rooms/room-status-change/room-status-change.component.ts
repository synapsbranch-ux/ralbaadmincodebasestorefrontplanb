import { RoomsService } from './../rooms.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'room-status-change',
  templateUrl: './room-status-change.component.html',
  styleUrls: ['./room-status-change.component.scss']
})
export class RoomtStatusChangeComponent implements  OnInit {
  renderValue: string;
  renderValueOpp: string;
  editBtnColor: string;
  userrole:any;
  isAdmin:boolean =false;
  room_status_name:any

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor( private roomservice: RoomsService, private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {

    this.userrole=localStorage.getItem("user_role");
    if(this.userrole == 'admin'){
      this.isAdmin=true;
    }

    this.renderValue = this.rowData.status;
    if(this.rowData.status == 'active'){  
      this.renderValue='active';
      this.renderValueOpp='Pending';
  }
  else
  {
      this.renderValue='pending';
      this.renderValueOpp='Active';
  }
  }

  statusChange()
  {
    // console.log('status_name',this.renderValue);
    // console.log('room_id',this.rowData._id);
    // console.log('vendor_id',this.rowData.vendor._id);
  
    if(this.renderValue == 'active')
    {
      this.renderValue= "pending"; 
      this.renderValueOpp='Active';
    }
    else
    {
      this.renderValue="active";
      this.renderValueOpp='Pending';
    }

    let jsondata=
    {
      "room_id": this.rowData._id,
      "vendor_id" : this.rowData.vendor._id,
      "status" : this.renderValue
  
    }
      this.roomservice.singleRoomStatuschange(jsondata).subscribe(
        res => {
          this.toastr.success('Room Status Updated','Success' );
          this.router.navigateByUrl('/vendors/create-vendors', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/vendors/vendor-list-room/'+this.rowData.vendor._id]);
          });
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
          // .... HANDLE ERROR HERE 
          // console.log(error.message);
      }
      ); 
  
  }
}