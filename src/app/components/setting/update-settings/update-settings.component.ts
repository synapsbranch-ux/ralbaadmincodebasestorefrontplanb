import { ToastrService } from 'ngx-toastr';
import { SettingService } from './settings.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-store',
  templateUrl: './update-settings.component.html',
  styleUrls: ['./update-settings.component.scss']
})
export class EditSettingsComponent implements OnInit {


  userrole:any;
  isAdmin:boolean =false;

  addtocartStatus:any;
  quentityStatus:any;
  settings_id:any;

  closeResult = '';

  constructor(private toastrService : ToastrService, public settingservice: SettingService, private route: ActivatedRoute, private router : Router) { 

  }

   

ngOnInit() {
  this.userrole=localStorage.getItem("user_role");
  if(this.userrole == 'admin'){
    this.isAdmin=true;
  }

  if(this.userrole == 'admin')
  {
    this.settingservice.allSettingsAdmin().subscribe(
      res =>
      {
        this.settings_id=res.data[0]._id;
        this.addtocartStatus=res.data[0].addto_cart_status;
        this.quentityStatus=res.data[0].quentity_status;

        console.log('Settings List',res.data[0]);
      },
      error => {
        this.toastrService.error(error.error.message)
    }
    )

  }




}

hideaddtoCart(val:any)
{
  if(val == 'active')
  {
    this.addtocartStatus='inactive';
  }
  if(val == 'inactive')
  {
    this.addtocartStatus='active';
  }

  let sData=
{
  "settings_id": this.settings_id,
  "addto_cart_status": this.addtocartStatus,
  "quentity_status": this.quentityStatus
}

this.settingservice.updateSetrtingsAdmin(sData).subscribe(
  res =>
  {

    this.toastrService.success('Hide Product Button Status Updated');
    console.log('hide Cart',this.addtocartStatus);
  },
  error => {
    this.toastrService.error(error.error.message)
}
  );


}

hidequentity(val:any)
{
  if(val == 'active')
  {
    this.quentityStatus='inactive';
  }
  if(val == 'inactive')
  {
    this.quentityStatus='active';
  }

let sData=
{
  "settings_id": this.settings_id,
  "addto_cart_status": this.addtocartStatus,
  "quentity_status": this.quentityStatus
}

this.settingservice.updateSetrtingsAdmin(sData).subscribe(
  res =>
  {

    this.toastrService.success('Hide Quentity Section Status Update');
    console.log('hide quentity',this.quentityStatus);
  },
  error => {
    this.toastrService.error(error.error.message)
}
  );
}


}
