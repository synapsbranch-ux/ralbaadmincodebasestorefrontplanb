import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AddonsCategoryService } from '../addons-category.service';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-addons',
  templateUrl: './edit-addons.component.html',
  styleUrls: ['./edit-addons.component.scss']
})
export class EditAddonsComponent implements OnInit {
  userrole: any;
  isAdmin: boolean = false;
  public addonsSubmitForm: FormGroup;
  addonsjsonData: any;
  addonsResultjsonData: any;
  // Caching results to avoid redundant calculations
  private cachedAddonValues: { [key: string]: any } = {};

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public addons_service: AddonsCategoryService, private route: ActivatedRoute, private router: Router, private toster: ToastrService, private timingService: TimingService) {


  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.categoryDetails();

    const staticFormControls = {
    };

    this.addonsSubmitForm = this.formBuilder.group(staticFormControls);
  }

  categoryDetails() {
    let catOBJ = {
      category_id: this.route.snapshot.paramMap.get('id')
    }

    this.addons_service.singleCategoryDetails(catOBJ).subscribe(
      res => {
        this.addonsjsonData = res.data.addons;
        // console.log('this.res.data ====================>',this.addonsjsonData)
        this.ceateForm();
      },
      error => {
        this.toster.error(error.error.message)
      }
    )
    let addonsOBJ = {
      product_category_id: this.route.snapshot.paramMap.get('id')
    }

    this.addons_service.categoryAddonsDetails(addonsOBJ).subscribe(
      res => {
        if(res.data.length !== 0){
          this.addonsResultjsonData = res.data[0].add_ons;
        }
        // console.log('this.res.data ====================>', res.data[0].add_ons)
        this.cachedAddonValues = {}; // Clear cache when data is refreshed
      },
      error => {
        this.toster.error(error.error.message)
      }
    )
  }

  ceateForm() {
    // console.log('this.addonsjsonData ====================>', this.addonsjsonData)
    const formControlsConfig = {};
    if (this.addonsjsonData) {
      for (const item of this.addonsjsonData) {
        if (item.add_ons_input == 'select' || item.add_ons_input == 'checkbox' || item.add_ons_input == 'radio') {
          for (const option of item.add_ons_value) {
            const controlName = item.add_ons_name.includes(' ')
              ? item.add_ons_name.toLowerCase()
                .replace(/ /g, '_')
                .replace(/[^\w-]+/g, '')
              : item.add_ons_name.toLowerCase();
            const controlNameValue = option.values.includes(' ')
              ? option.values.toLowerCase()
                .replace(/ /g, '_')
                .replace(/[^\w-]+/g, '')
              : option.values.toLowerCase();
            formControlsConfig[controlName + '-' + controlNameValue + '_addons'] = new FormControl();
          }
        }
        else {
          const controlName = item.add_ons_name.includes(' ')
            ? item.add_ons_name.toLowerCase()
              .replace(/ /g, '_')
              .replace(/[^\w-]+/g, '')
            : item.add_ons_name.toLowerCase();
          formControlsConfig[controlName + '_addons'] = new FormControl();
        }

      }
    }
    this.addonsSubmitForm = this.formBuilder.group(formControlsConfig);

  }

  getAddonValue(addonsSlug: string): any {
    // Check if the value is already cached
    if (!this.cachedAddonValues[addonsSlug]) {
      this.cachedAddonValues[addonsSlug] = this.addonsValueByslug(addonsSlug);
    }
    return this.cachedAddonValues[addonsSlug];
  }

  addonsValueByslug(addonsSlug: string): any {
    // console.log('addonsSlug', addonsSlug)
    if (this.addonsResultjsonData) {
      for (let i = 0; i < this.addonsResultjsonData.length; i++) {
        const addons = this.addonsResultjsonData[i];
        if (addons.addon_slug + '_addons' === addonsSlug) {
          return addons.add_ons_value[0].price;
        } else if (addons.add_ons_value) {
          for (let j = 0; j < addons.add_ons_value.length; j++) {
            const subaddons = addons.add_ons_value[j];
            if (subaddons.value_slug === addonsSlug) {
              return subaddons.price;
            }
          }
        }
      }
    }
    return null;
  }

  isInputType(input: string): boolean {
    return input === 'input';
  }

  getFormControlName(name: string): string {
    return name.toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');
  }


  onStoreEdit() {
    let formData = this.addonsSubmitForm.value;
    formData.product_category_id = this.route.snapshot.paramMap.get('id');
    // console.log('formData =============================**************', formData);
    this.addons_service.singleCategoryUpdate(formData).subscribe(
      res => {
        this.toster.success('Addons Updated successfully')
        this.timingService.runWithDelay(() => {
          this.router.navigate(['/vendor-addons/list-addons-category/']);
        }, 2000);  // 2000 milliseconds = 2 seconds
      },
      error => {
        this.toster.error(error.error.message)
      }
    );
  }

}
