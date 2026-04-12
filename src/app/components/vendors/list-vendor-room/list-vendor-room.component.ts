
import { RoomtStatusChangeComponent } from './../../rooms/room-status-change/room-status-change.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorsService } from './../vendor.service';

@Component({
selector: 'app-room',
templateUrl: './list-vendor-room.component.html',
styleUrls: ['./list-vendor-room.component.scss']
})
export class ListVendorRoomComponent implements OnInit {

roomLists=[];
roomavailable:boolean=false;

userrole:any;
isAdmin:boolean =false;
room_status_name:any

constructor( private router: Router, private vendorsservice: VendorsService, private route: ActivatedRoute) {

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
    localStorage.setItem('vendor-id',this.route.snapshot.paramMap.get('id'));
    this.router.navigate(['/vendors/vendor-edit-room/'+dataObject["data"]._id]);
  });

  this.smartTable.delete.subscribe( (dataObject: any) => {

    var result = confirm("Want to delete?");
    if (result) {
      
    // console.log('Room Deleted', dataObject["data"]._id);
    
    if(this.userrole == 'admin')
    {
    
    let room=
    {
      "room_id": dataObject["data"]._id,
      "vendor_id": dataObject["data"].vendor._id,
    }
    this.vendorsservice.singleRoomDeleteAdmin(room).subscribe(
      res =>
      {
        let rData=
        {
          vendor_id: this.route.snapshot.paramMap.get('id')
        }
        this.vendorsservice.allRoomlistVendorAdmin(rData).subscribe(
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
    
    

  });
}

allRoomListfn()
{


/////  Admin All Store   /////////

if(this.userrole == 'admin')
{
  let rData=
  {
    vendor_id: this.route.snapshot.paramMap.get('id')
  }
this.vendorsservice.allRoomlistVendorAdmin(rData).subscribe(
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

edit_room(room_id)
{
  localStorage.setItem('vendor-id',this.route.snapshot.paramMap.get('id'));
this.router.navigate(['/vendors/vendor-edit-room/'+room_id]);
// console.log('Room Edit', room_id);
}

delete_room(room_id, vendor_id)
{

var result = confirm("Want to delete?");
if (result) {
  
// console.log('Room Deleted', room_id);

if(this.userrole == 'admin')
{

let room=
{
  "room_id": room_id,
  "vendor_id": vendor_id,
}
this.vendorsservice.singleRoomDeleteAdmin(room).subscribe(
  res =>
  {
    let rData=
    {
      vendor_id: this.route.snapshot.paramMap.get('id')
    }
    this.vendorsservice.allRoomlistVendorAdmin(rData).subscribe(
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

}

statusChange(room_id,status_name, vendor_id)
{
// console.log('status_name',status_name);
  // console.log('room_id',room_id);
  // console.log('vendor_id',vendor_id);

if(status_name == 'active')
{
  this.room_status_name="inactive"; 
}
if(status_name == 'inactive')
{
  this.room_status_name="active";
}
  let jsondata=
  {
    "room_id": room_id,
    "vendor_id" : vendor_id,
    "status" : this.room_status_name

  }
    this.vendorsservice.singleRoomStatuschange(jsondata).subscribe(
      res => {
        this.allRoomListfn();
        // console.log('Room Updated',res);  
      },
      error => {
        // .... HANDLE ERROR HERE 
        // console.log(error.message);
    }
    ); 

}


}
