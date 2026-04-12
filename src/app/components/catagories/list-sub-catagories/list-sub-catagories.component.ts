
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatagoriesService } from '../catagories.service';
import { ViewChildSubCatagoriesBtnComponent } from '../view-child-sub-catagories/view-child-sub-catagories.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-list-sub-catagories',
  templateUrl: './list-sub-catagories.component.html',
  styleUrls: ['./list-sub-catagories.component.scss']
})
export class ListSubCatagoriesComponent implements OnInit {

  userrole: any;
  isAdmin: boolean = false;
  subcatagoriesList = [];
  mainsubcatagoriesList = [];
  store_status_name: any;
  delete_subcatagories_id: any;
  showButton: boolean = true;
  sub_category_id = '';
  categoryName: any;
  isFormEdit: boolean = false;

  @ViewChild('subcatagoriesDelete', { static: true })
  subcatagoriesDelete!: TemplateRef<any>;
  public subCatagoriesSubmitForm: FormGroup;

  displayedColumns: string[] = ['category_name', 'subCategory', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private router: Router, private catagoriesservice: CatagoriesService, private route: ActivatedRoute, private dialog: MatDialog, private toaster: ToastrService) {

  }


  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.route.paramMap.subscribe(params => {
      const catid = params.get('catid');
      if (catid) {
        this.allSubcatagoriesList();
      }
    });

    this.subCatagoriesSubmitForm = new FormGroup({
      'sub_catagories_name': new FormControl(null, [Validators.required])

    });

    if (localStorage.getItem('cat_id') != this.route.snapshot.paramMap.get('catid')) {
      this.sub_category_id = this.route.snapshot.paramMap.get('catid');
    }

    this.allSubcatagoriesList();

  }

  get sub_catagories_name() { return this.subCatagoriesSubmitForm.get('sub_catagories_name'); }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  allSubcatagoriesList() {
    if (this.userrole == 'admin') {
      let subcatOBJ = {
        "category_id": localStorage.getItem('cat_id')
      };

      this.catagoriesservice.singleCatagoriesDetails(subcatOBJ).subscribe(
        res => {
          this.mainsubcatagoriesList = res.data[0].child_categories;
          const routeCatId = this.route.snapshot.paramMap.get('catid');
          console.log("localStorage.getItem('cat_id') == this.route.snapshot.paramMap.get('catid')", localStorage.getItem('cat_id') == routeCatId);

          if (localStorage.getItem('cat_id') == routeCatId) {
            this.subcatagoriesList = res.data[0].child_categories;
          } else {
            let finsubcategories = this.findCategoryId(this.mainsubcatagoriesList, routeCatId);
            console.log('finsubcategories.sub_categories', finsubcategories);
            this.subcatagoriesList = finsubcategories ? finsubcategories.child_categories : [];
          }

          // Refresh dataSource with the updated data
          this.dataSource.data = this.subcatagoriesList;
          this.dataSource.paginator = this.paginator;  // Assign paginator here
          this.dataSource.sort = this.sort;  // Assign sort here
        },
        error => {
          this.toaster.error(error.error.message);
        }
      );
    }
  }


  findCategoryId(json, targetId) {
    for (let i = 0; i < json.length; i++) {
      const category = json[i];
      if (category.category_id === targetId) {
        return category;
      } else if (category.child_categories.length > 0) {
        const result = this.findCategoryId(category.child_categories, targetId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }


  deleteConfirm() {
    let catagories =
    {
      "category_id": localStorage.getItem('cat_id'),
      "child_categories_id": this.delete_subcatagories_id
    }

    if (this.userrole == 'admin') {
      this.catagoriesservice.singleSubCatagoriesDelete(catagories).subscribe(
        res => {
          this.allSubcatagoriesList();
        },
        error => {
          this.toaster.error(error.error.message)
        }
      )

    }
  }

  // onDeleteConfirm(event) {
  //   console.log('event Delete =======================>', event);
  //   this.delete_subcatagories_id = event.data.category_id;
  //   this.dialog.open(this.subcatagoriesDelete, { disableClose: false });
  // }

  // onEditConfirm(event) {
  //   console.log('event Edit =======================>', event)
  //   let jsondata =
  //   {
  //     "child_category_name": event.newData.category_name,
  //     "category_id": localStorage.getItem('cat_id'),
  //     "child_categories_id": event.newData.category_id,
  //   }


  //   this.catagoriesservice.udateSubCatagories(jsondata).subscribe(
  //     res => {

  //       this.allSubcatagoriesList();
  //       console.log('Sub Categories return', res);
  //     },
  //     error => {
  //       this.toaster.error(error.error.message)
  //     }
  //   );

  // }

  // onCreateConfirm(event) {
  //   console.log('event ======================', event.newData.category_name);
  //   if (event.newData.category_name) {


  //     if (localStorage.getItem('cat_id') == this.route.snapshot.paramMap.get('catid')) {
  //       let jsondata =
  //       {
  //         "child_category_name": event.newData.category_name,
  //         "category_id": localStorage.getItem('cat_id'),
  //         "child_categories_id": event.newData.category_id ? event.newData.category_id : ''
  //       }
  //       this.catagoriesservice.addSubCatagories(jsondata).subscribe(
  //         res => {

  //           this.allSubcatagoriesList();
  //           console.log('Categories return', res);
  //         },
  //         error => {
  //           this.toaster.error(error.error.message)
  //         }
  //       );
  //     }
  //     else {
  //       let jsondata =
  //       {
  //         "child_category_name": event.newData.category_name,
  //         "category_id": localStorage.getItem('cat_id'),
  //         "child_categories_id": this.route.snapshot.paramMap.get('catid')
  //       }


  //       this.catagoriesservice.addSubCatagories(jsondata).subscribe(
  //         res => {

  //           this.allSubcatagoriesList();
  //           console.log('Categories return', res);
  //         },
  //         error => {
  //           this.toaster.error(error.error.message)
  //         }
  //       );
  //     }
  //   }
  //   else {
  //     this.toaster.error(`field name cannot be blank`)
  //   }
  // }

  viewChildCategory(subCat) {
    this.router.navigateByUrl('categories/list-categories', { skipLocationChange: false }).then(() => {
      this.router.navigate(['/categories/list-sub-categories/' + subCat.category_id]);
    });
  }

  delete(subCat) {
    this.delete_subcatagories_id = subCat.category_id;
    this.dialog.open(this.subcatagoriesDelete, { disableClose: false })
  }
  edit(subCat) {
    this.categoryName = subCat.category_name;
    this.isFormEdit = true;
    this.sub_category_id = subCat.category_id;
  }

  onSubCatagoriesSubmit() {
    if (this.subCatagoriesSubmitForm.invalid) {
      this.subCatagoriesSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.subCatagoriesSubmitForm.value;

    if (this.subCatagoriesSubmitForm.invalid) {
      return;
    }


    let jsondata =
    {
      category_id: localStorage.getItem('cat_id'),
      child_categories_id: this.sub_category_id ? this.sub_category_id : '',
      child_category_name: formData.sub_catagories_name
    }

    if (this.isFormEdit) {

      this.catagoriesservice.udateSubCatagories(jsondata).subscribe(
        res => {

          this.allSubcatagoriesList();
          this.toaster.success('Sub Category Updated')
          this.isFormEdit = false;
          this.subCatagoriesSubmitForm.reset();
          this.categoryName = '';
        },
        error => {
          this.toaster.error(error.error.message)
        }
      );
    }
    else {
      this.catagoriesservice.addSubCatagories(jsondata).subscribe(
        res => {

          this.toaster.success('Sub Category Created')
          this.allSubcatagoriesList();
          this.subCatagoriesSubmitForm.reset();
        },
        error => {
          this.toaster.error(error.error.message)
        }
      );
    }

  }

  handleEnter(event: KeyboardEvent, nextElementId?: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (nextElementId) {
        const nextElement = document.getElementById(nextElementId);
        if (nextElement) {
          nextElement.focus();
        }
      } else {
        // If no next element id is provided, submit the form
        this.onSubCatagoriesSubmit();
      }
    }
  }

}
