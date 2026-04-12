import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatagoriesService } from '../catagories.service';
import { ViewSubCatagoriesBtnComponent } from '../view-sub-catagories/view-sub-catagories.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


@Component({
selector: 'app-list-attribute-verient',
templateUrl: './list-attribute-verient.component.html',
styleUrls: ['./list-attribute-verient.component.scss']
})
export class ListAttributeVerientComponent implements OnInit {
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
    {title: 'input', value: 'input'},
    {title: 'list', value: 'list'},
    {title: 'dropdown', value: 'dropdown'},
    {title: 'radioButton', value: 'radioButton'},
  ]
  
  attributeVerientList = [
    {
      varient_name:'White',
      varient_value:'#fff'
  
  
    }
  ];
  
  public settings = {
    // hideSubHeader: true,
    columns: {
      varient_name: {
        title: 'Varient Name',
      },
      varient_value: {
        title: 'Varient Value',
      },
    },   
  };
  
  
  
  constructor( private router: Router, private catagoriesservice: CatagoriesService, private route: ActivatedRoute, private dialog: MatDialog,private toastrService: ToastrService) {
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
  
  ngAfterViewInit(): void {
  
    this.smartTable.edit.subscribe( (dataObject: any) => {
     
      this.router.navigate(['/catagories/edit-catagories/'+dataObject["data"]._id]);
    });
    
  
    this.smartTable.delete.subscribe( (dataObject: any) => {
      this.delete_catagories_id=dataObject["data"]._id;
      this.dialog.open(this.catagoriesDelete,{ disableClose: false });
    });
  
  
  
  }
  
  
  
  onCreateConfirm(event) {
    console.log('event ======================',event);
    this.attributeVerientList = [...this.attributeVerientList, event.newData];
  
  }
  
  onSaveConfirm(event) {
  
   this.attributeVerientList =  this.attributeVerientList.filter(function(value, index, arr){
        if(value.varient_name == event.newData.varient_name){
          value.varient_name = event.newData.varient_name;
          value.varient_value = event.newData.varient_value;
  
        }
       return value;
    });
  }
  
  deleteConfirm()
  {
         
        let catagories=
        {
          "category_id": this.delete_catagories_id
        }

        if(this.userrole == 'admin')
        {
          this.catagoriesservice.singleCatagoriesDelete(catagories).subscribe(
            res =>
            {
              this.catagoriesservice.allCatagorieslist().subscribe(
                res =>{
                  this.catagoriesList=res['data'];
                },
                error => {
                  this.toastrService.error(error.error.message)
              }
              )
            }
          )
      
        }
  
  }
  
  
  
  }
  