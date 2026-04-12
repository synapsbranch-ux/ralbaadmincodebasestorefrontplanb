import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageGuidlineService } from '../image-guideline.service';

@Component({
selector: 'app-list-image-guideline',
templateUrl: './list-image-guideline.component.html',
styleUrls: ['./list-image-guideline.component.scss']
})
export class ListImageGuidelineComponent implements OnInit {

userrole:any;
isAdmin:boolean =false;
imageinstlist=[];
imageinstavailable:boolean=false;

store:any;
store_status_name:any;

constructor( private router: Router, private imageguidlineservice: ImageGuidlineService, private route: ActivatedRoute) {

}


ngOnInit() {

this.userrole=localStorage.getItem("user_role");
if(this.userrole == 'admin'){
this.isAdmin=true;
}
if(this.isAdmin)
{
this.imageguidlineservice.allImageinstlistAdmin().subscribe(
  res =>{
    this.imageinstlist=res['data'];
    if(this.imageinstlist.length > 0)
    {
      this.imageinstavailable=true;
    }
    else
    {
      this.imageinstavailable=false;
    }
    // console.log('List Of Image Inst API ==== ',res);
  },
)
}

}


edit_imageinst(imageinst_id)
{
this.router.navigate(['/images/edit-imageguideline/'+imageinst_id]);
// console.log('Image Inst Edit', imageinst_id);
}




}
