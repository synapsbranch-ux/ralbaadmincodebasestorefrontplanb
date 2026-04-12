
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import{RoomsService} from "../rooms.service"

@Component({
selector: 'app-room',
templateUrl: './list-room-texture.component.html',
styleUrls: ['./list-room-texture.component.scss']
})
export class ListRoomTextureComponent implements OnInit {

roomTextureLists=[];
roomavailable:boolean=false;

userrole:any;
isAdmin:boolean =false;
room_status_name:any

constructor( private router: Router, private roomservice: RoomsService, private route: ActivatedRoute, private toastrService: ToastrService) {

}

@ViewChild('table')
smartTable: any
;

public settings = {
  // hideSubHeader: true,
  columns: {
    sl_no: {
      title: '#'
    },
    topside: {
      title: 'Top',
      type:'html',
      valuePrepareFunction: (value) =>
      { return '<img width="100px"  src= ' + value + '  />' },
    },
    floorside: {
      title: 'Floor',
      type:'html',
      valuePrepareFunction: (value) =>
      { return '<img width="100px"  src= ' + value + '  />' },
    },    
    leftside: {
      title: 'Left',
      type:'html',
      valuePrepareFunction: (value) =>
      { return '<img width="100px"  src= ' + value + '  />' },
    },
    rightside: {
      title: 'Right',
      type:'html',
      valuePrepareFunction: (value) =>
      { return '<img width="100px"  src= ' + value + '  />' },
    },
    frontside: {
      title: 'Front',
      type:'html',
      valuePrepareFunction: (value) =>
      { return '<img width="100px"  src= ' + value + '  />' },
    },
    backside: {
      title: 'Back',
      type:'html',
      valuePrepareFunction: (value) =>
      { return '<img width="100px"  src= ' + value + '  />' },
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
this.allRoomTextureList();

}

ngAfterViewInit(): void {

  this.smartTable.edit.subscribe( (dataObject: any) => {
    //// console.log('Edit Objects ===============>',dataObject);
    this.router.navigate(['/rooms/edit-room-texture/'+dataObject['data']._id]);
  });
  this.smartTable.delete.subscribe( (dataObject: any) => {
    var result = confirm("Want to delete?");
    if (result) {
      if(this.userrole == 'admin')
    {
    
      let tdata=
      {
        "texture_id": dataObject['data']._id
      }
      this.roomservice.textureDetailsDelete(tdata).subscribe(
      res =>
      {
        this.allRoomTextureList();
        this.toastrService.success('Texture Deleted');
        this.router.navigate(['/rooms/list-room-texture']);
        // console.log('Delete Texture ID',res)
      }
    )
    }
    }
  });
}


allRoomTextureList()
{
/////  Admin All Store   /////////

if(this.userrole == 'admin')
{
this.roomservice.allRoomtextureAdmin().subscribe(
  res =>{
    let obj_arr_appended = res["data"][0].texture_images.map(function(currentValue, Index) {
      currentValue.sl_no = Index + 1,
      currentValue.topside=currentValue.top[0].image,
      currentValue.floorside=currentValue.floor[0].image,
      currentValue.leftside=currentValue.left[0].image,
      currentValue.rightside=currentValue.right[0].image,
      currentValue.frontside=currentValue.front[0].image,
      currentValue.backside=currentValue.back[0].image
      return currentValue
   })
    this.roomTextureLists=obj_arr_appended;
    if(this.roomTextureLists.length > 0)
    {
      this.roomavailable=true;
    }
    else
    {
      this.roomavailable=false;
    }
    // console.log('List Of ROOM TEXTURE API ==== ',res["data"][0].texture_images);
  }
)
}
}

}
