import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../auth/_service/admin.service';

@Component({
  selector: 'app-update-module-access',
  templateUrl: './update-module-access.component.html',
  styleUrls: ['./update-module-access.component.scss']
})
export class UpdateModuleAccessComponent implements OnInit {


  userrole:any;
  isAdmin:boolean =false;
  listMoules=[];
  subadminmodule=[]

  closeResult = '';

  constructor(private toastrService : ToastrService, public adminservice: AdminService, private route: ActivatedRoute, private router : Router) { 

  }

   

ngOnInit() {
  this.userrole=localStorage.getItem("user_role");
  if(this.userrole == 'admin'){
    this.isAdmin=true;
  }

  if(this.userrole == 'admin')
  {
    this.adminservice.adminModuleList().subscribe(
      res =>
      {
        this.listMoules=res['data'];
        // console.log('ModuleList API',res['data']);
      },
      error => {
        this.toastrService.error(error.error.message)
    }
    )
    let SAData=
    {
        subadmin_id: this.route.snapshot.paramMap.get('id')

    }

    this.adminservice.subadminModuleList(SAData).subscribe(
      res =>
      {
        this.subadminmodule=res['data'];
        // console.log('subadminmodule API',res['data']);
      },
      error => {
        this.toastrService.error(error.error.message)
    }
    )

  }
}

moduleSelect(mid:any)
{

  let mData=
  {
    subadmin_id: this.route.snapshot.paramMap.get('id'),
    module_id: mid
  }

  this.adminservice.subadminModuleupdate(mData).subscribe(
    res =>
        {
          this.toastrService.success('module assign updated successfully');
        },
        error => {
          this.toastrService.error(error.error.message)
      }
  )
}

getSelectionmodule(mid:any)
{
  if(this.subadminmodule != undefined)
  {
    return this.subadminmodule.findIndex(s => s.module_id === mid) !== -1;
  }
}

}
