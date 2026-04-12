
import { DepartmentStatusChangeComponent } from './../../departments/department-status-change/department-status-change.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorsService } from '../vendor.service';

@Component({
  selector: 'app-room',
  templateUrl: './list-vendor-department.component.html',
  styleUrls: ['./list-vendor-department.component.scss']
})
export class ListVendorDepartmentComponent implements OnInit {

  departmentList=[];
  departmentavailable:boolean=false;
  
  userrole:any;
  isAdmin:boolean =false;
  department_status_name:any

  constructor( private router: Router, private Vendorsservice: VendorsService, private route: ActivatedRoute) {

  }


  @ViewChild('table')
  smartTable: any
  ;

  public settings = {
    // hideSubHeader: true,
    columns: {
      department_image:{
        title: 'Department Image',
        type:'html',
        valuePrepareFunction: (value) =>
        { return '<img width="100px" class="product_image" src= ' + value + '  />' },
      },
      department_name: {
        title: 'Department Title'
      },
      department_store: {
        title: 'Store Name',

        valuePrepareFunction: (value) =>
        {
          return value['store_name'] },
      },
      button: {
        title: 'Status',
        type: 'custom',
        renderComponent: DepartmentStatusChangeComponent,
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
  this.allDepartmentList();

}

allDepartmentList()
{

  localStorage.setItem('current-vendor',this.route.snapshot.paramMap.get('id'));

/////  Admin All Store   /////////

if(this.userrole == 'admin')
{
  let adData=
  {
    vendor_id : this.route.snapshot.paramMap.get('id')
  }

  this.Vendorsservice.allDepartmentAdmin(adData).subscribe(
    res =>{
      this.departmentList=res['data'];
      if(this.departmentList.length > 0)
      {
        this.departmentavailable=true;
      }
      else
      {
        this.departmentavailable=false;
      }
      // console.log('List Of Department API ==== ',res);
    }
  )

}

}


ngAfterViewInit(): void {

  this.smartTable.edit.subscribe( (dataObject: any) => {
        localStorage.setItem('vendor-id',this.route.snapshot.paramMap.get('id'))
        this.router.navigate(['/vendors/vendor-edit-department/'+dataObject["data"]._id]);
  });

  this.smartTable.delete.subscribe( (dataObject: any) => {

    var result = confirm("Want to delete?");
    if (result) {
       
      let department=
      {
        "department_id": dataObject["data"]._id
      }
    
      if(this.userrole == 'admin')
      {
        this.Vendorsservice.singleDepartmentDeleteAdmin(department).subscribe(
          res =>
          {
            let adData=
            {
              vendor_id : this.route.snapshot.paramMap.get('id')
            }
            this.Vendorsservice.allDepartmentAdmin(adData).subscribe(
              res =>{
                this.departmentList=res['data'];
                if(this.departmentList.length > 0)
                {
                  this.departmentavailable=true;
                }
                else
                {
                  this.departmentavailable=false;
                }
    
    
                // console.log('List Of Department API ==== ',res);
              }
            )
            this.allDepartmentList();
            // console.log('Store Deleted', res);
          }
        )
    
      }
    
    }
    
      // console.log('Department Deleted', dataObject["data"]._id);

  });
}

// edit_department(department_id)
// {
//   localStorage.setItem('vendor-id',this.route.snapshot.paramMap.get('id'))
//   this.router.navigate(['/vendors/vendor-edit-department/'+department_id]);
//   // console.log('Department Edit', department_id);
// }

// delete_department(department_id)
// {

//   var result = confirm("Want to delete?");
// if (result) {
   
//   let department=
//   {
//     "department_id": department_id
//   }

//   if(this.userrole == 'admin')
//   {
//     this.Vendorsservice.singleDepartmentDeleteAdmin(department).subscribe(
//       res =>
//       {
//         let adData=
//         {
//           vendor_id : this.route.snapshot.paramMap.get('id')
//         }
//         this.Vendorsservice.allDepartmentAdmin(adData).subscribe(
//           res =>{
//             this.departmentList=res['data'];
//             if(this.departmentList.length > 0)
//             {
//               this.departmentavailable=true;
//             }
//             else
//             {
//               this.departmentavailable=false;
//             }


//             // console.log('List Of Department API ==== ',res);
//           }
//         )
//         this.allDepartmentList();
//         // console.log('Store Deleted', res);
//       }
//     )

//   }

// }

//   // console.log('Department Deleted', department_id);
  
// }



// statusChange(store_id,status_name)
// {
//   if(status_name == 'active')
//   {
//     this.department_status_name="inactive"; 
//   }
//   if(status_name == 'inactive')
//   {
//     this.department_status_name="active";
//   }
//     let jsondata=
//     {
//       "department_id": store_id,
//       "status" : this.department_status_name
  
//     }
  
//       this.Vendorsservice.singleDepartmentStatuschange(jsondata).subscribe(
//         res => {
//           this.allDepartmentList();
//           // console.log('Department Updated',res);  
//         },
//         error => {
//           // .... HANDLE ERROR HERE 
//           // console.log(error.message);
//       }
//       ); 


// }

}
