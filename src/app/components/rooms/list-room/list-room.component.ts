import { MatDialog } from '@angular/material/dialog';
import { RoomtStatusChangeComponent } from './../room-status-change/room-status-change.component';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import{RoomsService} from "../rooms.service"

@Component({
selector: 'app-room',
templateUrl: './list-room.component.html',
styleUrls: ['./list-room.component.scss']
})
export class ListRoomComponent implements OnInit {

roomLists=[];
roomavailable:boolean=false;

userrole:any;
isAdmin:boolean =false;
room_status_name:any
delete_room_id:any;
delete_room_vendor:any;

@ViewChild('roomDelete', { static: true })
roomDelete!: TemplateRef<any>;

constructor( private router: Router, private roomservice: RoomsService, private route: ActivatedRoute, private dialog: MatDialog) {

}


@ViewChild('table')
smartTable: any
;

public settings = {
  // hideSubHeader: true,
  columns: {
    room_name: {
      title: 'Room Title'
    },
    department: {
      title: 'Room Department',

      valuePrepareFunction: (value) =>
      {
        return value['department_name'] },
    },
    roomelement: {
      title: 'Room Element',

      valuePrepareFunction: (value) =>
      {
        return value['roomelement_name'] },
    },
    roomcount: {
      title: 'Room Element No'
    },
    button: {
      title: 'Room Status',
      type: 'custom',
      renderComponent: RoomtStatusChangeComponent,
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
this.allRoomListfn();

}

ngAfterViewInit(): void {

  this.smartTable.edit.subscribe( (dataObject: any) => {
    this.router.navigate(['/rooms/edit-room/'+dataObject["data"]._id]);
  });

  this.smartTable.delete.subscribe( (dataObject: any) => {

    this.delete_room_id=dataObject["data"]._id;
    this.delete_room_vendor=dataObject["data"].vendor._id;
    this.dialog.open(this.roomDelete,{ disableClose: false });
  
  });
}

deleteConfirm()
{
    if(this.userrole == 'vendor')
    {
    
    let room=
    {
      "room_id": this.delete_room_id
    }
    this.roomservice.singleRoomDelete(room).subscribe(
      res =>
      {
        this.roomservice.allRoomlist().subscribe(
          res =>{
            this.roomLists=res['data'];
            if(this.roomLists.length > 0)
            {
              this.roomavailable=true;
            }
            else
            {
              this.roomavailable=false;
            }
            // console.log('List Of ROOM API ==== ',res);
          }
        )
            
        // console.log('Room Deleted', res);
      }
    )
    }
    
    if(this.userrole == 'admin')
    {
    
    let room=
    {
      "room_id": this.delete_room_id,
      "vendor_id": this.delete_room_vendor,
    }
    this.roomservice.singleRoomDeleteAdmin(room).subscribe(
      res =>
      {
        this.roomservice.allRoomlist().subscribe(
          res =>{
            this.roomLists=res['data'];
            if(this.roomLists.length > 0)
            {
              this.roomavailable=true;
            }
            else
            {
              this.roomavailable=false;
            }
            // console.log('List Of ROOM API ==== ',res);
          }
        )
            
        // console.log('Room Deleted', res);
      }
    )
    }

}

allRoomListfn()
{
  /////  Vendor All Store   ///////

if(this.userrole == 'vendor')
{

this.roomservice.allRoomlist().subscribe(
  res =>{
    this.roomLists=res['data'];
    if(this.roomLists.length > 0)
    {
      this.roomavailable=true;
    }
    else
    {
      this.roomavailable=false;
    }
    // console.log('List Of ROOM API ==== ',res);
  }
)
}

/////  Admin All Store   /////////

if(this.userrole == 'admin')
{
this.roomservice.allRoomlistAdmin().subscribe(
  res =>{
    this.roomLists=res['data'];
    if(this.roomLists.length > 0)
    {
      this.roomavailable=true;
    }
    else
    {
      this.roomavailable=false;
    }
    // console.log('List Of ROOM API ==== ',res);
  }
)
}
}
}
