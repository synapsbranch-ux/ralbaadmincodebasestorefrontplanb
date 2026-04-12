import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import{RoomsService} from "../../rooms/rooms.service";
import { Roomwalls } from 'src/app/shared/data/slider';

@Component({
  selector: 'app-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {


  
    departmentLists=[]
    subDepartmentsList=[]
    roomElementNo:number
    roomsize_check:boolean=false
    room_element_check:boolean=false
    roomelementname:any
    roomelementid:any
    roomavailablity:boolean=true;

    roomtextureFront=[]
    roomtextureRight=[]
    roomtextureBack=[]
    roomtextureLeft=[]
    roomtextureTop=[]
    roomtextureFloor=[]
    roomlefts=[];
    roomrights=[];
    roomtops=[];
    roomfloors=[];
    roomfonts=[];
    roombacks=[];

    roominsertValid: boolean = false;
    roominsertMessage:any

    public rooomSubmitForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public roomservice: RoomsService, private router : Router) { 
    
  }
   

ngOnInit() {

  this.rooomSubmitForm = new FormGroup({
    'room_name': new FormControl(null, [Validators.required]),
    // 'roomsize': new FormControl(null, [Validators.required]),
    'department_name': new FormControl(null, [Validators.required]),
    // 'room_element_no': new FormControl(null, [Validators.required]),
    'room_left_wall': new FormControl(null, [Validators.required]),
    'room_right_wall': new FormControl(null, [Validators.required]),
    'room_top_wall': new FormControl(null, [Validators.required]),
    'room_floor': new FormControl(null, [Validators.required]),
    'room_font_wall': new FormControl(null, [Validators.required]),
    'room_back_wall': new FormControl(null, [Validators.required]),
  });

    this.roomservice.allDepartment().subscribe(
        res =>{
          this.departmentLists=res['data'];
          // console.log('All DEpartment List API ======',res);
        }
      )

      this.roomservice.allRoomtexture().subscribe(
        res =>{
          // console.log('All Roomtexture List API ======',res);

          for (const element of res['data']) {
            // console.log(element);
            
            for (const element1 of element.texture_images) {
              // console.log(element1);
              this.roomtextureFront.push(element1.front);
              this.roomtextureRight.push(element1.right);
              this.roomtextureBack.push(element1.back);
              this.roomtextureLeft.push(element1.left);
              this.roomtextureTop.push(element1.top);
              this.roomtextureFloor.push(element1.floor);
            }

          }          
          // console.log('roomtextureLeft ===',this.roomtextureLeft);
        }
      )

}

public HomeSliderConfig: any = Roomwalls;

      // Create Room
      get room_name() { return this.rooomSubmitForm.get('room_name').value; }
      // get roomsize() { return this.rooomSubmitForm.get('roomsize').value; }
      get department_name() { return this.rooomSubmitForm.get('department_name').value; }
      // get room_element_no() { return this.rooomSubmitForm.get('room_element_no').value; }
      get room_left_wall() { return this.rooomSubmitForm.get('room_left_wall').value;}
      get room_right_wall() { return this.rooomSubmitForm.get('room_right_wall').value; }
      get room_top_wall() { return this.rooomSubmitForm.get('room_top_wall').value;}
      get room_floor() { return this.rooomSubmitForm.get('room_floor').value; }
      get room_font_wall() { return this.rooomSubmitForm.get('room_font_wall').value;}
      get room_back_wall() { return this.rooomSubmitForm.get('room_back_wall').value; }

onRoomSubmit()
{
    let formData = this.rooomSubmitForm.value;

    if (this.rooomSubmitForm.invalid) {
      return;
    }

    let jsondata = 
    {
      "room_name": formData.room_name,
      "department_id": formData.department_name,
      "roomelement_id": this.roomelementid,
      "roomsize": "61960164c26def056611e1db",
      "roomcount":"10",
      "texture": {
      "front_image_id": formData.room_font_wall,
      "right_image_id": formData.room_right_wall,
      "back_image_id": formData.room_back_wall,
      "left_image_id": formData.room_left_wall,
      "top_image_id": formData.room_top_wall,
      "floor_image_id": formData.room_floor,
      }
  }

      // console.log(jsondata);

      this.roomservice.addRooms(jsondata).subscribe(
        res => {

          // console.log('Room Addes',res);  
          
          this.roominsertMessage="Decoration Added successfully";
          this.roominsertValid = true;
          setTimeout(() => {
            this.router.navigate(['/rooms/list-room']);
          },10) 
        },
        error => {
          // .... HANDLE ERROR HERE 
          // console.log(error.message);
     }
      );      
}

// getdepartment(id)
// {

// const child =  this.departmentLists.map(function(d_room) {
//   if(d_room._id == id){    

//     // console.log(d_room.department_room.roomelement_name);
//     return d_room.department_room.roomelement_configaration;
//   }
// });

// const filterItem = child.filter(item => item != undefined);
// if(filterItem.length > 0){
//   this.subDepartmentsList = filterItem[0];
 
//   this.rooomSubmitForm.controls['roomsize'].enable();
// }



// }

getdepartment(id)
{

const child =  this.departmentLists.map((d_room) => {


  if(d_room._id == id){    
    let rData = 
    {
      "department_id": d_room._id,
      "vendor_id": localStorage.getItem("user_id"),
  }
    this.roomservice.roomAvailableCheck(rData).subscribe(
      res => {
  // console.log('Room Check API Result', res);

  if(res['data'].room_name)
  {
    this.roomavailablity=false;
    // console.log('Room Not Availbale');

  }
  else
  {
    this.roomavailablity=true;
    // console.log('Room Availbale');
  }
      }
    );

    // console.log('Choose Department Name : ',d_room.department_room.roomelement_name);
    return d_room.department_room;
  }
});

const filterItem = child.filter(item => item != undefined);
if(filterItem.length > 0){
  this.subDepartmentsList = filterItem[0].roomelement_configaration;
 this.roomelementname=filterItem[0].roomelement_name;
 this.roomelementid=filterItem[0]._id;
  // this.rooomSubmitForm.controls['roomsize'].enable();
  // console.log(filterItem[0]);
}



}

getroomtype(id)
{

const child =  this.subDepartmentsList.map(function(ds_room) {
  if(ds_room.room_size._id == id){    
    return ds_room.max_count;
  }
});

const filterItem = child.filter(item => item != undefined);
if(filterItem.length > 0){
  // console.log(filterItem);
  this.roomElementNo = filterItem[0];
  this.rooomSubmitForm.controls['room_element_no'].enable();
}

}


}
