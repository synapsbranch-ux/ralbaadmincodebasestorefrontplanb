import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorsService } from './../vendor.service';

import { Roomwalls } from 'src/app/shared/data/slider';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-room',
  templateUrl: './edit-vendor-room.component.html',
  styleUrls: ['./edit-vendor-room.component.scss']
})
export class EditVendorRoomComponent implements OnInit {
  subDepartmentsList = []
  departmentLists = [];
  public rooomSubmitForm: FormGroup;
  roomname: string;
  departmentid: any;
  roomsize_name: any;
  roomsize_id: any;
  roomElementNo: number;
  roomElementId_api: any;
  roomelementname: string;
  roomelementid: any
  roomcount: number;

  roomleft_id: any;
  roomright_id: any;
  roomtop_id: any;
  roomfloor_id: any;
  roomfont_id: any;
  roomback_id: any;

  roomtextureFront = []
  roomtextureRight = []
  roomtextureBack = []
  roomtextureLeft = []
  roomtextureTop = []
  roomtextureFloor = []

  roominsertValid: boolean = false;
  roominsertMessage: any

  userrole: any;
  isAdmin: boolean = false;
  vendor_id: any;

  public HomeSliderConfig: any = Roomwalls;

  constructor(private formBuilder: FormBuilder, public vendorsservice: VendorsService, private route: ActivatedRoute, private router: Router, private ngZone: NgZone) {
  }



  ngOnInit() {

    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

    this.rooomSubmitForm = new FormGroup({
      'room_name': new FormControl(null, [Validators.required]),
      'roomsize': new FormControl(null, [Validators.required]),
      'department_name': new FormControl(null, [Validators.required]),
      'room_element_no': new FormControl(null, [Validators.required]),
      'room_left_wall': new FormControl(null, [Validators.required]),
      'room_right_wall': new FormControl(null, [Validators.required]),
      'room_top_wall': new FormControl(null, [Validators.required]),
      'room_floor': new FormControl(null, [Validators.required]),
      'room_font_wall': new FormControl(null, [Validators.required]),
      'room_back_wall': new FormControl(null, [Validators.required]),
    });


    if (this.userrole == 'admin') {

      ////// Call VCedor Wise Department list

      let rData = {
        vendor_id: localStorage.getItem('vendor-id')
      }
      this.vendorsservice.allDepartmentAdmin(rData).subscribe(
        res => {
          this.departmentLists = res['data'];
          // console.log('Admin Department list',this.departmentLists,rData);
        }
      )

      this.vendorsservice.allRoomtextureAdmin().subscribe(
        res => {
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
          // console.log(this.roomtextureFront);
        }
      )

      // console.log('get product ID',this.route.snapshot.paramMap.get('id'));
      const roomid = {
        'room_id': this.route.snapshot.paramMap.get('id')
      };
      this.vendorsservice.singleRoomDetailsAdmin(roomid).subscribe(
        res => {
          // console.log('Single Room Details ====== ',res['data']);
          this.departmentid = res['data'].department._id;
          this.roomsize_name = res['data'].roomesize.roomsize_name;
          this.roomsize_id = res['data'].roomesize._id;
          this.roomcount = res['data'].roomcount;
          this.roomElementId_api = res['data'].roomelement._id;
          this.roomelementname = res['data'].roomelement.roomelement_name;

          this.roomleft_id = res['data'].texture[0].left._id;
          this.roomright_id = res['data'].texture[0].right._id;
          this.roomtop_id = res['data'].texture[0].top._id;
          this.roomfloor_id = res['data'].texture[0].floor._id;
          this.roomfont_id = res['data'].texture[0].front._id;
          this.roomback_id = res['data'].texture[0].back._id;
          this.vendor_id = res['data'].vendor._id;
          this.roomname = res['data'].room_name;
          this.getdepartment(this.departmentid);
          this.getroomtype(this.roomsize_id);
        },
        error => {
          // .... HANDLE ERROR HERE 
          // console.log(error.message);
        }
      );



    }

  }

  // Create Room
  get room_name() { return this.rooomSubmitForm.get('room_name').value; }
  get roomsize() { return this.rooomSubmitForm.get('roomsize').value; }
  get department_name() { return this.rooomSubmitForm.get('department_name').value; }
  get room_element_no() { return this.rooomSubmitForm.get('room_element_no').value; }
  get room_left_wall() { return this.rooomSubmitForm.get('room_left_wall').value; }
  get room_right_wall() { return this.rooomSubmitForm.get('room_right_wall').value; }
  get room_top_wall() { return this.rooomSubmitForm.get('room_top_wall').value; }
  get room_floor() { return this.rooomSubmitForm.get('room_floor').value; }
  get room_font_wall() { return this.rooomSubmitForm.get('room_font_wall').value; }
  get room_back_wall() { return this.rooomSubmitForm.get('room_back_wall').value; }

  onRoomEdit() {
    let formData = this.rooomSubmitForm.value;
    let jsondata;
    // console.log('formData.roomsize', formData.roomsize);
    // console.log('formData.room_element_no', formData.room_element_no)


    if (this.userrole == 'admin') {
      if (formData.roomsize === null && formData.room_element_no === null) {
        jsondata =
        {
          'room_id': this.route.snapshot.paramMap.get('id'),
          "vendor_id": this.vendor_id,
          "room_name": formData.room_name,
          "department_id": formData.department_name,
          "roomelement_id": this.roomElementId_api,
          "roomsize": this.roomsize_id,
          "roomcount": this.roomElementNo,
          "texture": {
            "front_image_id": formData.room_font_wall,
            "right_image_id": formData.room_right_wall,
            "back_image_id": formData.room_back_wall,
            "left_image_id": formData.room_left_wall,
            "top_image_id": formData.room_top_wall,
            "floor_image_id": formData.room_floor,

          }
        }
      }
      else {
        jsondata =
        {
          'room_id': this.route.snapshot.paramMap.get('id'),
          "vendor_id": this.vendor_id,
          "room_name": formData.room_name,
          "department_id": formData.department_name,
          "roomelement_id": this.roomelementid,
          "roomsize": formData.roomsize,
          "roomcount": formData.room_element_no,
          "texture": {
            "front_image_id": formData.room_font_wall,
            "right_image_id": formData.room_right_wall,
            "back_image_id": formData.room_back_wall,
            "left_image_id": formData.room_left_wall,
            "top_image_id": formData.room_top_wall,
            "floor_image_id": formData.room_floor,

          }
        }
      }

      this.vendorsservice.singleRoomUpdateAdmin(jsondata).subscribe(
        res => {

          // console.log('Room Updated',res);  
          this.roominsertMessage = "Room Updated successfully";
          this.roominsertValid = true;
          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigate(['/vendors/vendor-list-room/' + this.vendor_id]);
                });
              } else {
                requestAnimationFrame(checkTime);
              }
            };
            requestAnimationFrame(checkTime);
          });
          /// settimeout End

        },
        error => {
          // .... HANDLE ERROR HERE 
          // console.log(error.message);
        }
      );

    }


    // console.log(jsondata);



    // console.log('Room Submitted');
  }

  setDefaultValues() {

  }

  getdepartment(id) {

    const child = this.departmentLists.map(function (d_room) {
      if (d_room._id == id) {

        // console.log(d_room.department_room.roomelement_name);
        return d_room.department_room;
      }
    });

    const filterItem = child.filter(item => item != undefined);
    if (filterItem.length > 0) {
      this.subDepartmentsList = filterItem[0].roomelement_configaration;
      this.roomelementname = filterItem[0].roomelement_name;
      this.roomelementid = filterItem[0]._id;
      this.rooomSubmitForm.controls['roomsize'].enable();
    }



  }

  getroomtype(id) {

    const child = this.subDepartmentsList.map(function (ds_room) {
      if (ds_room.room_size._id == id) {
        return ds_room.max_count;
      }
    });

    const filterItem = child.filter(item => item != undefined);
    if (filterItem.length > 0) {
      // console.log(filterItem);
      this.roomElementNo = filterItem[0];
      this.rooomSubmitForm.controls['room_element_no'].enable();
    }

  }

}
