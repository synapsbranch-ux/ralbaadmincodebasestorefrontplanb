import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import{ProductService} from "../product.service"

@Component({
  selector: 'app-digital-add',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.scss']
})
export class EditCategoriesComponent implements OnInit,DoCheck {

  public productSubmitForm:FormGroup;
  
  subcatagory: boolean = false;
  chieldSubcatagory: boolean = false;
  departmentLists=[];
  catagoriesLists=[];
  subCatagoriesLists=[];
  clieldSubCatagories = [];
  varientList = [];


  constructor(private formBuilder: FormBuilder, public productservice: ProductService) { 

  }



ngOnInit() {

}

ngDoCheck()
{

}




}
