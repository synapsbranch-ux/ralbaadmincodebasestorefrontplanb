import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomsService } from '../rooms.service';
import '@google/model-viewer';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';



@Component({
selector: 'app-editroom-texture',
templateUrl: './editroom-texture.component.html',
styleUrls: ['./editroom-texture.component.scss']
})



export class EditRoomTextureComponent implements OnInit {

  private fileToUpload: File = null;
  uploadStoreImages:any;
  userrole:any;
  isAdmin:boolean =false;
  textureinsertValid: boolean = false;
  textureinsertinValid: boolean= false;
  textureinsertMessage:any
  storedessc:boolean=false;
  storenotavailable:boolean=false;

  public storeSubmitForm: FormGroup;
  public storeRequestSubmitForm: FormGroup;

  closeResult = '';
  
  textureLeftimage:any;
  textureLeft3Dimage:any;
  textureLeftId:any;

  textureRightimage:any;
  textureRight3Dimage:any;
  textureRightId:any;

  textureTopimage:any;
  textureTop3Dimage:any;
  textureTopId:any;

  textureFloorimage:any;
  textureFloor3Dimage:any;
  textureFloorId:any;

  textureFrontimage:any;
  textureFront3Dimage:any;
  textureFrontId:any;

  textureBackimage:any;
  textureBack3Dimage:any;
  textureBackId:any;

constructor( private route: ActivatedRoute , private modalService: NgbModal, private formBuilder: FormBuilder, public roomsservice: RoomsService, private router : Router , private toastrService: ToastrService) { 
}

  

ngOnInit() {
this.userrole=localStorage.getItem("user_role");
if(this.userrole == 'admin'){
this.isAdmin=true;
}

// console.log(localStorage.getItem('user_token'));
this.storeSubmitForm = new FormGroup({
  'store_name': new FormControl(null, [Validators.required]),
  'store_location': new FormControl(null, [Validators.required]),
  'store_desc': new FormControl(null),

});

this.getTextureDetails();

}

getTextureDetails()
{
  let sData=
  {
    "texture_id": this.route.snapshot.paramMap.get('id')
  }
  this.roomsservice.textureDetails(sData).subscribe(
    res =>
    {
     let RTData= res['data'].texture_images.reduce(
        (previousValue, currentValue) => {
      if(currentValue._id == this.route.snapshot.paramMap.get('id'))
      {
        return currentValue;
      }
      else
      {
        return previousValue;
      }
    
    
    },'');
      
// console.log('Texture Data ==========>',res['data'].texture_images)


      this.textureLeftimage= RTData.left[0].image;
      this.textureLeft3Dimage= RTData.left[0].image_3d;
      this.textureLeftId= RTData.left[0]._id;

      this.textureRightimage= RTData.right[0].image;
      this.textureRight3Dimage= RTData.right[0].image_3d;
      this.textureRightId= RTData.right[0]._id;

      this.textureTopimage= RTData.top[0].image;
      this.textureTop3Dimage= RTData.top[0].image_3d;
      this.textureTopId= RTData.top[0]._id;

      this.textureFloorimage= RTData.floor[0].image;
      this.textureFloor3Dimage= RTData.floor[0].image_3d;
      this.textureFloorId= RTData.floor[0]._id;

      this.textureFrontimage= RTData.front[0].image;
      this.textureFront3Dimage= RTData.front[0].image_3d;
      this.textureFrontId= RTData.front[0]._id;

      this.textureBackimage= RTData.back[0].image;
      this.textureBack3Dimage= RTData.back[0].image_3d;
      this.textureBackId= RTData.back[0]._id;



      // console.log('Service Details',res['data'].texture_images[0]);
    }
  );

}

updateTexture()
{

let aTData={
  "texture_id": this.route.snapshot.paramMap.get('id'),
  "front": [
      {
          "image": this.textureFrontimage,
          "image_3d" : this.textureFront3Dimage,
          "status": "active",
          "_id": this.textureFrontId,
      }
  ],
  "right": [
      {
        "image": this.textureRightimage,
        "image_3d" : this.textureRight3Dimage,
          "status": "active",
          "_id": this.textureRightId,
      }
  ],
  "back": [
      {
          "image": this.textureBackimage,
          "image_3d" : this.textureBack3Dimage,  
          "status": "active",
          "_id": this.textureBackId,
      }
  ],
  "left": [
      {
          "image": this.textureLeftimage,
          "image_3d" : this.textureLeft3Dimage,
          "status": "active",
          "_id": this.textureLeftId,
      }
  ],
  "top": [
      {
          "image": this.textureTopimage,
          "image_3d" : this.textureTop3Dimage,
          "status": "active",
          "_id": this.textureTopId,
      }
  ],
  "floor": [
      {
        "image": this.textureFloorimage,
        "image_3d" : this.textureFloor3Dimage,
          "status": "active",
          "_id": this.textureFloorId,
      }
  ]
}
// console.log('Room Texture Details',aTData);
if(this.textureFrontimage  && this.textureFront3Dimage  && this.textureRightimage  && this.textureBackimage  && this.textureBack3Dimage  && this.textureLeftimage && this.textureLeft3Dimage && this.textureTopimage && this.textureTop3Dimage  && this.textureFloorimage && this.textureFloor3Dimage )
{
  this.roomsservice.textureDetailsUpdate(aTData).subscribe(
    res =>
    {
      this.textureinsertMessage="Texture Updated successfully";
      this.textureinsertValid = true;
      this.textureinsertinValid= false;
      setTimeout(() => {
        this.router.navigate(['/rooms/list-room-texture']);
      },10); 
        // console.log('Texture Update Submit',res);
  
    }
  );

}
else
{
  this.textureinsertMessage="All Image Not Uploaded. Please Check Image Upload Guideline and Upload";
  this.textureinsertValid = false;
  this.textureinsertinValid= true;

}
}

public configLeft: DropzoneConfigInterface = {
clickable: true,
maxFiles: 1,
autoReset: null,
errorReset: null,
cancelReset: null,

accept: (file, done) => {
this.onAcceptLeft(file, done);
},

};

onAcceptLeft(ev: any, done: Function) {
if (ev) {
// console.log('Uplad File', ev)
const file = ev;
const img = new Image();
img.onload = () => {
// console.log('Current Width',img.width)
// console.log('Current Height',img.height)

//   // total: 2256862
//   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
//   // {
this.roomsservice.uploadImage(file).subscribe(
(res) => {
// console.log('Image Upload Sucess',res);
let image_link=res['data'].fileUrl
this.textureLeftimage=image_link;
},
(err) => {
// console.log('Image Upload Error',err);
})
//   // }

};
img.src = URL.createObjectURL(file);
// console.log('Iamge Type', ev.type);


} 

}

public configRight: DropzoneConfigInterface = {
clickable: true,
maxFiles: 1,
autoReset: null,
errorReset: null,
cancelReset: null,

accept: (file, done) => {
this.onAcceptRight(file, done);
},

};


onAcceptRight(ev: any, done: Function) {
if (ev) {
// console.log('Uplad File', ev)
const file = ev;
const img = new Image();
img.onload = () => {
  // console.log('Current Width',img.width)
  // console.log('Current Height',img.height)

  //   // total: 2256862
//   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
//   // {
this.roomsservice.uploadImage(file).subscribe(
(res) => {
// console.log('Image Upload Sucess',res);
let image_link=res['data'].fileUrl
this.textureRightimage=image_link;
},
(err) => {
  // console.log('Image Upload Error',err);
})
//   // }

};
img.src = URL.createObjectURL(file);
// console.log('Iamge Type', ev.type);


} 
}


public configTop: DropzoneConfigInterface = {
clickable: true,
maxFiles: 1,
autoReset: null,
errorReset: null,
cancelReset: null,

accept: (file, done) => {
this.onAcceptTop(file, done);
},

};


onAcceptTop(ev: any, done: Function) {
if (ev) {
// console.log('Uplad File', ev)
  const file = ev;
  const img = new Image();
  img.onload = () => {
    // console.log('Current Width',img.width)
    // console.log('Current Height',img.height)

    //   // total: 2256862
//   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
//   // {
this.roomsservice.uploadImage(file).subscribe(
  (res) => {
  // console.log('Image Upload Sucess',res);
  let image_link=res['data'].fileUrl
  this.textureTopimage=image_link;
  },
  (err) => {
    // console.log('Image Upload Error',err);
  })
//   // }

  };
  img.src = URL.createObjectURL(file);
  // console.log('Iamge Type', ev.type);

  
} 
}

public configFloor: DropzoneConfigInterface = {
clickable: true,
maxFiles: 1,
autoReset: null,
errorReset: null,
cancelReset: null,

accept: (file, done) => {
this.onAcceptFloor(file, done);
},

};


onAcceptFloor(ev: any, done: Function) {
if (ev) {
// console.log('Uplad File', ev)
    const file = ev;
    const img = new Image();
    img.onload = () => {
      // console.log('Current Width',img.width)
      // console.log('Current Height',img.height)

      //   // total: 2256862
//   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
//   // {
  this.roomsservice.uploadImage(file).subscribe(
    (res) => {
    // console.log('Image Upload Sucess',res);
    let image_link=res['data'].fileUrl
    this.textureFloorimage=image_link;
    },
    (err) => {
      // console.log('Image Upload Error',err);
    })
//   // }

    };
    img.src = URL.createObjectURL(file);
    // console.log('Iamge Type', ev.type);

    
  } 
}

public configFront: DropzoneConfigInterface = {
clickable: true,
maxFiles: 1,
autoReset: null,
errorReset: null,
cancelReset: null,

accept: (file, done) => {
this.onAcceptFront(file, done);
},

};


onAcceptFront(ev: any, done: Function) {
if (ev) {
  // console.log('Uplad File', ev)
      const file = ev;
      const img = new Image();
      img.onload = () => {
        // console.log('Current Width',img.width)
        // console.log('Current Height',img.height)
  
        //   // total: 2256862
  //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
  //   // {
    this.roomsservice.uploadImage(file).subscribe(
      (res) => {
      // console.log('Image Upload Sucess',res);
      let image_link=res['data'].fileUrl
      this.textureFrontimage=image_link;
      },
      (err) => {
        // console.log('Image Upload Error',err);
      })
  //   // }
  
      };
      img.src = URL.createObjectURL(file);
      // console.log('Iamge Type', ev.type);
  
      
    } 
}

public configBack: DropzoneConfigInterface = {
clickable: true,
maxFiles: 1,
autoReset: null,
errorReset: null,
cancelReset: null,

accept: (file, done) => {
  this.onAcceptBack(file, done);
},

};


onAcceptBack(ev: any, done: Function) {
  if (ev) {
    // console.log('Uplad File', ev)
        const file = ev;
        const img = new Image();
        img.onload = () => {
          // console.log('Current Width',img.width)
          // console.log('Current Height',img.height)
    
          //   // total: 2256862
    //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
    //   // {
      this.roomsservice.uploadImage(file).subscribe(
        (res) => {
        // console.log('Image Upload Sucess',res);
        let image_link=res['data'].fileUrl
        this.textureBackimage=image_link;
        },
        (err) => {
          // console.log('Image Upload Error',err);
        })
    //   // }
    
        };
        img.src = URL.createObjectURL(file);
        // console.log('Iamge Type', ev.type);
    
        
      } 
}

// 3D Images

public configLeft3D: DropzoneConfigInterface = {
  clickable: true,
  maxFiles: 1,
  autoReset: null,
  errorReset: null,
  cancelReset: null,
  
  accept: (file, done) => {
  this.onAcceptLeft3D(file, done);
  },
  
  };
  
  onAcceptLeft3D(ev: any, done: Function) {
  if (ev) {
  // console.log('Uplad File', ev)
  const file = ev;
  const img = new Image();
  img.onload = () => {
  // console.log('Current Width',img.width)
  // console.log('Current Height',img.height)
  
  //   // total: 2256862
  //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
  //   // {
  this.roomsservice.uploadImage(file).subscribe(
  (res) => {
  // console.log('Image Upload Sucess',res);
  let image_link=res['data'].fileUrl
  this.textureLeft3Dimage=image_link;
  },
  (err) => {
  // console.log('Image Upload Error',err);
  })
  //   // }
  
  };
  img.src = URL.createObjectURL(file);
  // console.log('Iamge Type', ev.type);
  
  
  } 
  
  }
  
  public configRight3D: DropzoneConfigInterface = {
  clickable: true,
  maxFiles: 1,
  autoReset: null,
  errorReset: null,
  cancelReset: null,
  
  accept: (file, done) => {
  this.onAcceptRight3D(file, done);
  },
  
  };
  
  
  onAcceptRight3D(ev: any, done: Function) {
  if (ev) {
  // console.log('Uplad File', ev)
  const file = ev;
  const img = new Image();
  img.onload = () => {
    // console.log('Current Width',img.width)
    // console.log('Current Height',img.height)
  
    //   // total: 2256862
  //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
  //   // {
  this.roomsservice.uploadImage(file).subscribe(
  (res) => {
  // console.log('Image Upload Sucess',res);
  let image_link=res['data'].fileUrl
  this.textureRight3Dimage=image_link;
  },
  (err) => {
    // console.log('Image Upload Error',err);
  })
  //   // }
  
  };
  img.src = URL.createObjectURL(file);
  // console.log('Iamge Type', ev.type);
  
  
  } 
  }
  
  
  public configTop3D: DropzoneConfigInterface = {
  clickable: true,
  maxFiles: 1,
  autoReset: null,
  errorReset: null,
  cancelReset: null,
  
  accept: (file, done) => {
  this.onAcceptTop3D(file, done);
  },
  
  };
  
  
  onAcceptTop3D(ev: any, done: Function) {
  if (ev) {
  // console.log('Uplad File', ev)
    const file = ev;
    const img = new Image();
    img.onload = () => {
      // console.log('Current Width',img.width)
      // console.log('Current Height',img.height)
  
      //   // total: 2256862
  //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
  //   // {
  this.roomsservice.uploadImage(file).subscribe(
    (res) => {
    // console.log('Image Upload Sucess',res);
    let image_link=res['data'].fileUrl
    this.textureTop3Dimage=image_link;
    },
    (err) => {
      // console.log('Image Upload Error',err);
    })
  //   // }
  
    };
    img.src = URL.createObjectURL(file);
    // console.log('Iamge Type', ev.type);
  
    
  } 
  }
  
  public configFloor3D: DropzoneConfigInterface = {
  clickable: true,
  maxFiles: 1,
  autoReset: null,
  errorReset: null,
  cancelReset: null,
  
  accept: (file, done) => {
  this.onAcceptFloor3D(file, done);
  },
  
  };
  
  
  onAcceptFloor3D(ev: any, done: Function) {
  if (ev) {
  // console.log('Uplad File', ev)
      const file = ev;
      const img = new Image();
      img.onload = () => {
        // console.log('Current Width',img.width)
        // console.log('Current Height',img.height)
  
        //   // total: 2256862
  //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
  //   // {
    this.roomsservice.uploadImage(file).subscribe(
      (res) => {
      // console.log('Image Upload Sucess',res);
      let image_link=res['data'].fileUrl
      this.textureFloor3Dimage=image_link;
      },
      (err) => {
        // console.log('Image Upload Error',err);
      })
  //   // }
  
      };
      img.src = URL.createObjectURL(file);
      // console.log('Iamge Type', ev.type);
  
      
    } 
  }
  
  public configFront3D: DropzoneConfigInterface = {
  clickable: true,
  maxFiles: 1,
  autoReset: null,
  errorReset: null,
  cancelReset: null,
  
  accept: (file, done) => {
  this.onAcceptFront3D(file, done);
  },
  
  };
  
  
  onAcceptFront3D(ev: any, done: Function) {
  if (ev) {
    // console.log('Uplad File', ev)
        const file = ev;
        const img = new Image();
        img.onload = () => {
          // console.log('Current Width',img.width)
          // console.log('Current Height',img.height)
    
          //   // total: 2256862
    //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
    //   // {
      this.roomsservice.uploadImage(file).subscribe(
        (res) => {
        // console.log('Image Upload Sucess',res);
        let image_link=res['data'].fileUrl
        this.textureFront3Dimage=image_link;
        },
        (err) => {
          // console.log('Image Upload Error',err);
        })
    //   // }
    
        };
        img.src = URL.createObjectURL(file);
        // console.log('Iamge Type', ev.type);
    
        
      } 
  }
  
  public configBack3D: DropzoneConfigInterface = {
  clickable: true,
  maxFiles: 1,
  autoReset: null,
  errorReset: null,
  cancelReset: null,
  
  accept: (file, done) => {
    this.onAcceptBack3D(file, done);
  },
  
  };
  
  
  onAcceptBack3D(ev: any, done: Function) {
    if (ev) {
      // console.log('Uplad File', ev)
          const file = ev;
          const img = new Image();
          img.onload = () => {
            // console.log('Current Width',img.width)
            // console.log('Current Height',img.height)
      
            //   // total: 2256862
      //   // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
      //   // {
        this.roomsservice.uploadImage(file).subscribe(
          (res) => {
          // console.log('Image Upload Sucess',res);
          let image_link=res['data'].fileUrl
          this.textureBack3Dimage=image_link;
          },
          (err) => {
            // console.log('Image Upload Error',err);
          })
      //   // }
      
          };
          img.src = URL.createObjectURL(file);
          // console.log('Iamge Type', ev.type);
      
          
        } 
  }
  


public onUploadError(args: any): void { 
// console.log('onUploadError:', args);
}

public onUploadSuccess(args: any): void {
}




open(content) {
this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
}, (reason) => {
  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
});
}

private getDismissReason(reason: any): string {
if (reason === ModalDismissReasons.ESC) {
  return 'by pressing ESC';
} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  return 'by clicking on a backdrop';
} else {
  return `with: ${reason}`;
}
}

opengbl(content2) {
  this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}


}
