import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatagoriesService } from '../catagories.service';
import { ViewSubCatagoriesBtnComponent } from '../view-sub-catagories/view-sub-catagories.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewAttributeVerientBtnComponent } from '../view-attribute-verient/view-attribute-verient.component';
import { ToastrService } from 'ngx-toastr';

@Component({
selector: 'list-addons',
templateUrl: './list-addons.component.html',
styleUrls: ['./list-addons.component.scss']
})
export class ListAddonsComponent implements OnInit {
userrole:any;
isAdmin:boolean =false;
catagoriesList=[];
delete_catagories_id:any
catagories:any;
store_status_name:any;

@ViewChild('catagoriesDelete', { static: true })
catagoriesDelete!: TemplateRef<any>;

@ViewChild('table')
smartTable: any
;
inputlist=[
  {title: 'Input Text', value: 'input'},
  {title: 'CheckbBox', value: 'checkbox'},
  {title: 'Dropdown List', value: 'dropdown'},
  {title: 'Radio Button', value: 'radiobutton'},
]

attributeList = [
  {
    attribute_id:10001,
    attribute_name:'Color',
    attribute_type:'checkbox'
  }
];

public settings = {
  // hideSubHeader: true,
  columns: {
    attribute_name: {
      title: 'Attribute Name',
    },
    attribute_type: {
      title: 'Attribute Type',
      filter: false,
      width: '250px',
      type: 'html',
      editor: {
        type: 'list',
        config: {                  
          list: this.inputlist,  
        },
      }
    } ,
    button: {
      title: 'Verients',
      type: 'custom',
      filter:false,
      renderComponent: ViewAttributeVerientBtnComponent,
      
    },


  },   
};



constructor( private router: Router, private catagoriesservice: CatagoriesService, private route: ActivatedRoute, private dialog: MatDialog, private toastrService:ToastrService) {
}


ngOnInit() {

this.userrole=localStorage.getItem("user_role");
if(this.userrole == 'admin'){
this.isAdmin=true;
}
this.allCatagoriesList();

const elements = document.querySelectorAll('.ng2-smart-action-add-add');
console.log('elements =========================',elements)
elements.forEach((element) => {
  element.addEventListener('click', () => {
    
    const inputElement = document.querySelector('input[placeholder="Verients"]') as HTMLInputElement | null;
console.log('inputElement =========================',inputElement)
    if (inputElement) {
      // do something with the input element, e.g. hide it
      inputElement.style.display = 'none';
    } else {
      console.error('Input element not found');
    }

  });
});



}

allCatagoriesList() {

/////  Admin All Banner   /////////

if(this.userrole == 'admin')
{
this.catagoriesservice.allCatagorieslist().subscribe(
  res =>{
    // this.catagoriesList=res['data'];
    this.catagoriesList=[];
  },
  error => {
    this.toastrService.error(error.error.message)
}
)

}



} 



onCreateConfirm(event) {
  console.log('event ======================',event);
  this.attributeList = [...this.attributeList, event.newData];

}



}
