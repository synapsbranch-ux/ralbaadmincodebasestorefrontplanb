import { map, debounceTime } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, DoCheck, OnChanges, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from "../product.service"
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import '@google/model-viewer';
import { TimingService } from 'src/app/timing.service';


@Component({
  selector: 'edit-product',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss']
})
export class EditProductComponent implements OnInit {

  public productSubmitForm: FormGroup;
  subcatagory: boolean = false;
  chieldSubcatagory: boolean = false;
  departmentLists = [];
  storeLists = [];
  catagoriesLists = [];
  allCatagoriesLists = [];
  mainCatagoriesLists = [];
  varientList = [];
  productinsertValid: boolean = false;
  productinsertinValid: boolean = false;
  productinsertMessage: any
  productId: any
  productname: string;
  catagoriestid: any;
  subcatagoriestid: any;
  childsubcatagoriestid: any;
  productprice: any;
  saleprice: any;
  product_availability: any;
  productdesc: any;
  productSKU: any;
  vendor_id: any;
  varientListApi = [];
  external_links: any;
  private fileToUpload: File = null;
  uploadImages = [];
  upload2DImage_Tryon: any;
  upload2DImage_TryonId: any;
  upload3DImage: any;
  upload3DImageId: any;
  upload3DImage_Store: any;
  upload3DImage_StoreId: any;
  upload3DImage_Tryon: any;
  upload3DImage_TryonId: any;
  userrole: any;
  isAdmin: boolean = false;
  closeResult = '';
  stock_dt: any;
  imagelist = [];
  disable_input: boolean = false;
  productSlug: any;
  productglb_name: any
  productStoreglb_name: any
  productTryonglb_name: any
  productTryon2d_name: any
  attributejsonData: any;
  addonsjsonData: any;
  catagories_id: any;
  productattributejsonData: any;
  productaddonsjsonData: any;
  customAddonService: boolean = false;
  AddonService: boolean = false;
  uploadAttributeImage = []
  selectedCategory: any;
  parentcategory: any
  allSubcategorylist = [];
  allBrandList = [];
  selectedBrand: any;
  selectedBrandId: any;
  subCategories = []
  productbgcolor: any
  selectedTags: any;
  selectedFilledTags: any;
  tagList = [];
  approveGLBStatus: any;
  adminStatus: boolean = false;
  vendorStatus: boolean = false;
  totalControls: any
  metaTags: string[] = [];

  @ViewChild('contentSubCategories', { static: true }) contentSubCategories: ElementRef;
  @ViewChild('productsku', { static: true }) productsku: ElementRef;
  skuvaluecount: any
  vendor_type: any;
  requestButton: boolean = false;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public productservice: ProductService, private route: ActivatedRoute, private router: Router, private toaster: ToastrService, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.vendor_type = localStorage.getItem("vendor_type")
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    else {
      this.disable_input = false;
    }
    if (this.vendor_type == 'access') {
      this.disable_input = true;
    }

    const product_slug = this.route.snapshot.paramMap.get('id');


    this.productservice.allCatagories().subscribe(
      res => {
        // console.log('Categories List ===================>',res['data'][0])
        this.mainCatagoriesLists = res['data'];
        // for(let i=0; i< this.mainCatagoriesLists.length; i++ )
        // {
        //   this.flatcategories(res['data'][i],this.catagoriesLists);
        // }

        this.allCatagoriesLists = res['data'];

      },
      error => {
        this.toaster.error(error.error.message)
      }
    )

    this.createForm();

    if (this.disable_input) {
      this.productSubmitForm.controls['product_name'].disable();
      this.productSubmitForm.controls['catagories_name'].disable();
      this.productSubmitForm.controls['brand_name'].disable();
      this.productSubmitForm.controls['product_price'].disable();
      this.productSubmitForm.controls['sale_price'].disable();
      this.productSubmitForm.controls['product_availability'].disable();
      this.productSubmitForm.controls['stock'].disable();
      this.productSubmitForm.controls['product_desc'].disable();
      this.productSubmitForm.controls['product_sku'].disable();
      this.productSubmitForm.controls['product_bg_color'].disable();
      this.productSubmitForm.controls['product_3dservice'].disable();
      this.productSubmitForm.controls['external_link'].disable();
      this.productSubmitForm.controls['is_addons_required'].disable();
      this.productSubmitForm.controls['is_custom_addons'].disable();
      this.productSubmitForm.controls['tag_List'].disable();
      this.productSubmitForm.controls['metaTagInput'].disable();
      this.productSubmitForm.controls['product_meta_tags'].disable();
    }
    if (this.disable_input) {
      this.config.clickable = false;
    }

    if (this.userrole == 'admin') {
      this.productservice.allAdminTaglist().subscribe(
        res => {
          this.tagList = res['data'];
        },
        error => {
          this.toaster.error(error.error.message)
        }
      );
    }
    if (this.userrole == 'vendor') {
      this.productservice.allTaglist().subscribe(
        res => {
          this.tagList = res['data'];
        },
        error => {
          this.toaster.error(error.error.message)
        }
      );
    }

    this.productservice.getproductsBySlugs(product_slug).subscribe(
      res => {
        let categoriesname = '';
        this.productId = res['data']._id;
        this.productSlug = res['data'].product_slug;
        this.productname = res['data'].product_name;
        this.catagoriestid = res['data'].product_category_id;
        this.productprice = res['data'].product_retail_price;
        this.saleprice = res['data'].product_sale_price;
        this.product_availability = res['data'].product_availability;
        this.productdesc = res['data'].product_description;
        this.productbgcolor = res['data'].product_bg_color;
        this.uploadImages = res['data'].product_image;
        this.selectedTags = res['data'].tags;
        this.approveGLBStatus = res['data'].vendorproductaccesses?.status;
        this.adminStatus = res['data'].vendorproductaccesses?.admin_approve;
        this.vendorStatus = res['data'].vendorproductaccesses?.vendor_approve;
        let productMeta = res['data'].product_meta_tags;

        if (productMeta) {
          if (Array.isArray(productMeta)) {
            // If it's an array with one comma-separated string
            if (productMeta.length === 1 && typeof productMeta[0] === 'string' && productMeta[0].includes(',')) {
              this.metaTags = productMeta[0].split(',').map(tag => tag.trim());
            } else {
              // Already an array of tags
              this.metaTags = productMeta.map(tag => tag.trim());
            }
          } else if (typeof productMeta === 'string') {
            // If backend gave a plain string
            this.metaTags = productMeta.split(',').map(tag => tag.trim());
          } else {
            this.metaTags = [];
          }

          // Always update formControl as comma-separated string
          this.productSubmitForm.get('product_meta_tags')?.setValue(this.metaTags.join(','));
        } else {
          this.metaTags = [];
          this.productSubmitForm.get('product_meta_tags')?.setValue('');
        }


        if (this.selectedTags) {
          // Extract brand names from top_brands
          this.selectedFilledTags = this.selectedTags.map(iterator => iterator.tag_name);
          console.log('this.selectedFilledTags', this.selectedFilledTags);
        }

        this.imagelist = this.uploadImages;
        if (res['data'].product_brand) {
          this.selectedBrand = res['data'].product_brand.brand_name;
          this.selectedBrandId = res['data'].product_brand._id
        }

        if (res['data'].product_sub_categories) {
          this.allSubcategorylist = res['data'].product_sub_categories;
        }
        if (res['data'].product_tryon_2d_image.length > 0) {
          this.upload2DImage_TryonId = res['data'].product_tryon_2d_image[0]._id;
          this.upload2DImage_Tryon = res['data'].product_tryon_2d_image[0].pro_2d_image;
          this.productTryon2d_name = res['data'].product_tryon_2d_image[0].pro_2d_image_name;
        }
        else {
          this.upload2DImage_TryonId = '';
          this.upload2DImage_Tryon = '';
          this.productTryon2d_name = '';
        }
        this.upload3DImageId = res['data'].product_3d_image[0]._id
        this.upload3DImage = res['data'].product_3d_image[0].pro_3d_image;

        if (res['data'].product_store_3d_image.length > 0) {
          this.upload3DImage_Store = res['data'].product_store_3d_image[0].pro_3d_image;
          this.upload3DImage_StoreId = res['data'].product_store_3d_image[0]._id;
          this.productStoreglb_name = res['data'].product_store_3d_image[0].pro_3d_image_name;
        }
        else {
          this.upload3DImage_Store = '';
          this.upload3DImage_StoreId = '';
          this.productStoreglb_name = '';
        }

        if (res['data'].product_tryon_3d_image.length > 0) {
          this.upload3DImage_Tryon = res['data'].product_tryon_3d_image[0].pro_3d_image;
          this.upload3DImage_TryonId = res['data'].product_tryon_3d_image[0]._id;
          this.productTryonglb_name = res['data'].product_tryon_3d_image[0].pro_3d_image_name;
        }
        else {
          this.upload3DImage_Tryon = '';
          this.upload3DImage_TryonId = '';
          this.productTryonglb_name = '';
        }
        this.productglb_name = res['data'].product_3d_image[0].pro_3d_image_name;
        this.productSKU = res['data'].product_sku;
        this.varientListApi = res['data'].product_varient_options;
        this.vendor_id = res['data'].product_owner._id;
        this.external_links = res['data'].product_external_link;
        this.stock_dt = res['data'].stock;
        this.productattributejsonData = res['data'].attributes;
        this.productaddonsjsonData = res['data'].add_ons;
        this.AddonService = res['data'].is_addons_required;
        this.customAddonService = res['data'].is_custom_addons;
        this.selectedCategory = res['data'].product_category_name;
        this.attributejsonData = res['data'].product_category.attributes;
        this.addonsjsonData = res['data'].product_category.addons;
        this.updateForm();
        this.catagories_id = res['data'].product_category_id;
        this.totalControls = this.allSubcategorylist.length;
        for (let [index, iterator] of this.allSubcategorylist.entries()) {
          if (iterator) {
            let main_cat = this.findParentObject(this.mainCatagoriesLists, 'category_id', iterator.category_id)
            let parent_category = this.findNestedAllObj(main_cat, iterator.category_id);
            let controlName = this.getFormControlName(iterator.category_name);
            let catObj =
            {
              "control_id": +index + 1,
              "category_id": this.catagories_id,
              "child_category_id": iterator.category_id,
              "formcontrol_name": controlName + '_subCat'
            }
            this.subCategories.push(catObj)
            console.log("this.subCategories", this.subCategories)
            this.addChildCategories(parent_category.child_categories, controlName + '_subCat', iterator.category_id, +index + 1);
          }

        }
        this.productservice.allBrands(this.catagoriestid).subscribe(
          res => {
            this.allBrandList = res['data'];
          },
          error => {
            this.toaster.error(error.error.message)
          }
        );
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )

    this.debounce(this.productsku.nativeElement, 'keyup').subscribe(val => {
      this.searchproductsku(val);
      // console.log(`Debounced Input: ${val}`);
    });
  }


  onTagKeydown(event: KeyboardEvent) {
    const inputValue = this.productSubmitForm.get('metaTagInput')?.value?.trim() || '';

    // Detect Enter or Comma key
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault(); // Stop "focus next input" logic

      if (inputValue && !this.metaTags.includes(inputValue)) {
        this.metaTags.push(inputValue);
        this.productSubmitForm.get('product_meta_tags')?.setValue(this.metaTags.join(','));
      }

      // Clear current input
      this.productSubmitForm.get('metaTagInput')?.reset();
    }
  }

  removeTag(index: number) {
    this.metaTags.splice(index, 1);
    this.productSubmitForm.get('product_meta_tags')?.setValue(this.metaTags.join(','));
  }

  addChildCategories(allCatagoriesLists, formcontrolname, selected_val, control_id: number) {
    this.clearControlsFrom(control_id);
    // Prefix the control_id with 'ctrl_' to make it valid
    let prefixedControlId = `ctrl_${control_id}`;
    console.log('this.totalControls', this.totalControls)
    // First, remove the existing subcategory if it exists
    if (this.totalControls > control_id) {
      for (let i = control_id; i < this.totalControls; i++) {
        prefixedControlId = `ctrl_${i}`;
        console.log('prefixedControlId', prefixedControlId);
        const existingSelectElement = this.contentSubCategories?.nativeElement.querySelector(`#${prefixedControlId}`);
        if (existingSelectElement) {
          existingSelectElement.remove();
        }
      }
    }


    // Create a new select element
    const selectElement = document.createElement('select');
    selectElement.classList.add('form-select');
    selectElement.classList.add('mt-4');
    selectElement.setAttribute('id', prefixedControlId); // Adding the prefixed ID
    selectElement.setAttribute('formControlName', formcontrolname);
    // Add an empty option as the default
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Set the value of the option to empty
    defaultOption.textContent = 'Select SubCategory'; // Text for the default option
    defaultOption.selected = true; // Make it selected by default
    defaultOption.disabled = false; // Enable the default option
    selectElement.appendChild(defaultOption);
    // Disable the select element if vendor_type is 'access'
    if (this.vendor_type === 'access') {
      selectElement.disabled = true;
    }
    // Add options to the select element
    allCatagoriesLists.forEach(category => {
      const optionElement = document.createElement('option');
      optionElement.value = category.category_id; // Set the value of the option
      optionElement.textContent = category.category_name; // Set the label of the option
      if (selected_val != null && category.category_id === selected_val) {
        optionElement.selected = true; // Pre-select the option if needed
      }
      selectElement.appendChild(optionElement);
    });

    // Add control to the form group
    this.productSubmitForm.addControl(formcontrolname, new FormControl());

    // Bind ngModel to selectedCategory
    selectElement.addEventListener('change', (event: any) => this.getSubchild(event.target.value, event.target.getAttribute('id')));

    // Append the new select element to the DOM
    this.contentSubCategories?.nativeElement.appendChild(selectElement);
  }



  removeChildCategory(formControlName: string) {
    // Remove the control from the form group
    this.productSubmitForm.removeControl(formControlName);

    // Remove the select element from the DOM
    const selectElement = this.contentSubCategories?.nativeElement.querySelector(`[formControlName="${formControlName}"]`);
    if (selectElement) {
      selectElement.remove();
    }
  }

  clearControlsFrom(controlId: number) {
    for (let i = controlId; i < this.totalControls; i++) {
      const formControlName = `subCategory_${i}`;
      this.productSubmitForm.removeControl(formControlName);

      const elementId = `ctrl_${i}`;
      const selectElement = this.contentSubCategories?.nativeElement.querySelector(`#${elementId}`);
      if (selectElement) {
        selectElement.remove();
      }
    }

    // Adjust totalControls count after removal
    this.totalControls = controlId;
  }

  clearAllSubCategories() {
    // Remove all subcategory-related form controls
    Object.keys(this.productSubmitForm.controls).forEach(controlName => {
      if (controlName.endsWith('_subCat')) {
        this.productSubmitForm.removeControl(controlName);
      }
    });

    // Remove all DOM elements inside the container
    if (this.contentSubCategories?.nativeElement) {
      this.contentSubCategories.nativeElement.innerHTML = '';
    }

    // Reset totalControls
    this.totalControls = 0;
  }


  request3DAsset() {
    let userDeatil = JSON.parse(localStorage.getItem('currentUser'));
    let Obj =
    {
      vendor_type: this.vendor_type,
      product_name: this.productname,
      vendor_name: userDeatil.name,
      vendor_id: userDeatil.vendor_id,
    }
    if (!this.requestButton) {
      if (this.productname) {
        this.productservice.request3DAsset(Obj).subscribe(
          res => {
            this.requestButton = true;
            this.toaster.success(res.message);
          },
          error => {
            this.toaster.error(error.error.message);
          }
        );
      }
      else {
        this.toaster.error("product name is required")
      }
    }


  }

  createForm() {
    const staticFormControls = {
      'product_name': new FormControl(null, [Validators.required]),
      'catagories_name': new FormControl(null, [Validators.required]),
      'brand_name': new FormControl(null, [Validators.required]),
      'product_price': new FormControl(null, [Validators.required, Validators.min(0)]),
      'sale_price': new FormControl(null, [Validators.min(0)]),
      'product_availability': new FormControl(null, [Validators.required]),
      'stock': new FormControl(null, [Validators.required]),
      'product_desc': new FormControl(null, [Validators.required]),
      'product_sku': new FormControl(null, [Validators.required]),
      'product_bg_color': new FormControl(null),
      'product_3dservice': new FormControl(null),
      'external_link': new FormControl(null),
      'is_addons_required': new FormControl(null),
      'is_custom_addons': new FormControl(null),
      'tag_List': new FormControl(null),
      'metaTagInput': new FormControl(null),
      'product_meta_tags': new FormControl(null)
    };

    this.productSubmitForm = this.formBuilder.group(staticFormControls);
  }

  flatcategories(data, result) {
    // console.log('data *********************************',data);  
    // console.log('result *********************************',result);  

    result.push({ ...data });
    if (data.child_categories && data.child_categories.length) {
      if (data.child_categories.length == 1)
        this.flatcategories(data.child_categories, result)
      else {
        let i = 0;
        while (data.child_categories.length > i) {
          this.flatcategories(data.child_categories[i], result);
          i++;
        }
      }
    }
    return result;
  }

  updateForm() {
    const formControlsConfig = { ...this.productSubmitForm.controls };

    console.log('this.attributejsonData --------------------', this.attributejsonData);
    if (this.attributejsonData) {
      for (const item of this.attributejsonData) {
        console.log("controlName item------------------", item)
        const controlName = item.attribute_name.includes(' ')
          ? item.attribute_name.toLowerCase()
            .replace(/ /g, '_')
            .replace(/[^\w-]+/g, '')
          : item.attribute_name.toLowerCase();
        console.log("controlName + '_attribute'------------------", controlName + '_attribute')

        formControlsConfig[controlName + '_attribute'] = new FormControl();
      }
    }

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

    this.productSubmitForm = this.formBuilder.group(formControlsConfig);
    console.log('formControlsConfig ========================', formControlsConfig)

  }

  attributeValueByslug(attSlug, inputtype) {
    for (let i = 0; i < this.productattributejsonData.length; i++) {
      const attribute = this.productattributejsonData[i];
      if (attribute.attribute_slug + '_attribute' === attSlug) {
        return attribute.value;
      }
    }
  }

  addonsValueByslug(addonsSlug, inputtype) {
    for (let i = 0; i < this.productaddonsjsonData.length; i++) {
      const addons = this.productaddonsjsonData[i];
      if (addons.addon_slug + '_addons' === addonsSlug) {
        return addons.add_ons_value[0].price;
      }
      else if (addons.add_ons_value) {
        for (let i = 0; i < addons.add_ons_value.length; i++) {
          const subaddons = addons.add_ons_value[i];
          if (subaddons.value_slug === addonsSlug) {
            return subaddons.price;
          }
        }
      }

    }
  }

  categoryDetailsFilter(catlisst, filtercatid) {
    let current_category_details = this.findCategoryId(catlisst, filtercatid)
    this.attributejsonData = current_category_details.attributes;
    this.addonsjsonData = current_category_details.addons;
    this.updateForm();

    console.log('current_category_details', current_category_details);
  }

  findCategoryId = (json, targetId) => {
    console.log('category._id ==============', json);
    console.log('targetId ====================', targetId);
    for (let i = 0; i < json.length; i++) {
      const category = json[i];

      if (category._id === targetId) {

        return category;
      } else if (category.child_categories.length > 0) {
        const result = this.findSubCategoryId(category.child_categories, targetId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  findSubCategoryId = (json, targetId) => {
    for (let i = 0; i < json.length; i++) {
      const category = json[i];
      if (category.category_id === targetId) {
        return category;
      } else if (category.child_categories.length > 0) {
        const result = this.findSubCategoryId(category.child_categories, targetId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  onSelectionChange(fieldName: string, event: any) {
    // Update form control with the latest selection
    this.productSubmitForm.get(fieldName)?.setValue(event);
  }


  isInputType(input: string): boolean {
    return input === 'input';
  }

  getFormControlName(name: string): string {
    return name.toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');
  }


  searchproductsku(data: any) {
    let SKUData =
    {
      product_sku: data
    }

    this.productservice.searchProductSKU(SKUData).subscribe(
      res => {
        this.skuvaluecount = res.data
        // console.log('SkU Find Status',res.data)
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )

  }

  getSelectionsize(item) {
    // console.log(this.varientListApi[0]);
    if (this.varientListApi[0] != undefined) {
      return this.varientListApi[0].size_options.findIndex(s => s === item) !== -1;
    }

  }

  getSelectioncolor(item) {
    // console.log('getSelectioncolor ====== ',this.varientListApi[1]);
    if (this.varientListApi[1] != undefined) {
      return this.varientListApi[1].color_options.findIndex(s => s === item) !== -1;
    }
  }

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 20,
    autoReset: null,
    errorReset: null,
    cancelReset: null,

  };


  drop(event: CdkDragDrop<{ _id: string; pro_image: string; status: string }[]>) {
    // // console.log('EVENTLOG : ',event)
    if (this.vendor_type != 'access') {
      moveItemInArray(this.uploadImages, event.previousIndex, event.currentIndex);
    }


  }


  onProductupdate(): void {
    // console.log('Product Update Deatils',jsondata);
    if (this.userrole == 'admin') {
      // console.log('productSubmitForm Form Values ========================>', this.productSubmitForm.value);
      // console.log('this.selectedFilledTags ===============', this.selectedFilledTags);
      // console.log('this.selectedTags ===============', this.selectedTags);
      // console.log("this.selectedFilledTags[0].hasOwnProperty('_id')",this.selectedFilledTags[0].hasOwnProperty('_id'));

      let formData = this.productSubmitForm.value;
      console.log('this.metaTags', this.metaTags);
      if (formData.product_name && formData.product_sku && formData.catagories_name && formData.product_price && formData.stock && formData.product_availability && formData.product_desc && (this.upload3DImage || this.imagelist.length > 0)) {
        let product_3dservice = 'inactive';
        if (formData.product_3dservice == true) {
          product_3dservice = 'active';
        }
        formData.product_3dservice = product_3dservice;

        let elink
        elink = formData.external_link;
        if (elink == null) {
          elink = ""
        }
        formData.external_link = elink;

        const newArrayImages = this.uploadImages.map(({ original_image, ...keepAttrs }) => keepAttrs)
        formData.product_image = newArrayImages;

        let twodstoreImage = [
          {
            "_id": this.upload2DImage_TryonId,
            "pro_2d_image": this.upload2DImage_Tryon,
            "pro_2d_image_name": (this.productTryon2d_name) ? this.productTryon2d_name : '',
            "status": "active"
          }
        ]
        formData.product_tryon_2d_image = twodstoreImage

        let threedImage = [
          {
            "_id": this.upload3DImageId,
            "pro_3d_image": this.upload3DImage,
            "pro_3d_image_name": (this.productglb_name) ? this.productglb_name : '',
            "status": "active"
          }
        ]

        let threedstoreImage = [
          {
            "_id": this.upload3DImage_StoreId,
            "pro_3d_image": this.upload3DImage_Store,
            "pro_3d_image_name": (this.productStoreglb_name) ? this.productStoreglb_name : '',
            "status": "active"
          }
        ]
        formData.product_store_3d_image = threedstoreImage

        let threedtryonImage = [
          {
            "_id": this.upload3DImage_TryonId,
            "pro_3d_image": this.upload3DImage_Tryon,
            "pro_3d_image_name": (this.productTryonglb_name) ? this.productTryonglb_name : '',
            "status": "active"
          }
        ]
        formData.product_tryon_3d_image = threedtryonImage
        formData.product_3d_image = threedImage;
        formData.product_id = this.productId;
        formData.upload_attribute_image = this.uploadAttributeImage
        formData.vendor_id = this.vendor_id
        formData.catagories_name = this.catagories_id
        formData.subcategories = this.subCategories;
        formData.product_meta_tags = this.metaTags;
        formData.brand_name = formData.brand_name._id ? formData.brand_name._id : this.selectedBrandId;
        if (formData.tag_List) {
          formData.tag_List = (this.selectedFilledTags[0].hasOwnProperty('_id')) ? this.selectedFilledTags : this.selectedTags
        }

        if (formData.is_custom_addons == true) {
          formData.is_addons_required = true;
        }

        let sale_price_avl = parseInt(formData.sale_price) ? parseInt(formData.sale_price) : 0
        if (parseInt(formData.product_price) > sale_price_avl) {
          console.log('Final product Update ------------------', formData);
          this.productservice.updateProductsByAdmin(formData).subscribe(
            res => {
              // console.log('Product Updated',res);  
              this.productinsertMessage = "Product Updated successfully";
              this.productinsertValid = true;
              /// settimeout Start
              const startTime = performance.now();
              this.ngZone.runOutsideAngular(() => {
                const checkTime = (currentTime: number) => {
                  const elapsedTime = currentTime - startTime;
                  if (elapsedTime >= 2000) {
                    this.ngZone.run(() => {
                      this.router.navigate(['/vendors/vendor-product-list/' + this.vendor_id]);
                    });
                  } else {
                    requestAnimationFrame(checkTime);
                  }
                };
                requestAnimationFrame(checkTime);
              });
              /// settimeout End

            },
            error => {
              this.toaster.error(error.error.message)
            }
          );
        }
        else {
          this.toaster.error("Sales price should be less than the regular product price.")
        }
      }
      else {
        this.toaster.error("Please fill all mandatory fields")
      }
    }

    if (this.userrole == 'vendor' && this.vendor_type == 'access') {
      let threedImage = [
        {
          "_id": this.upload3DImageId,
          "pro_3d_image": this.upload3DImage,
          "pro_3d_image_name": (this.productglb_name) ? this.productglb_name : '',
          "status": "active"
        }
      ]
      let accessVProductObj = {
        product_id: this.productId,
        product_3d_image: threedImage
      }
      this.productservice.updateProducts(accessVProductObj).subscribe(
        res => {
          // console.log('Product Updated',res);  
          this.productinsertMessage = "Product Updated successfully";
          this.productinsertValid = true;

          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigate(['/products/product-list']);
                });
              } else {
                requestAnimationFrame(checkTime);
              }
            };
            requestAnimationFrame(checkTime);
          });
          /// settimeout End
        },
        error => {
          this.toaster.error(error.error.message)
        }
      );
    }

    if (this.userrole == 'vendor' && this.vendor_type !== 'access') {
      console.log('this.metaTags', this.metaTags);
      // console.log('productSubmitForm Form Values ========================>', this.productSubmitForm.value);
      // console.log('this.selectedFilledTags ===============', this.selectedFilledTags);
      // console.log('this.selectedTags ===============', this.selectedTags);
      // console.log("this.selectedFilledTags[0].hasOwnProperty('_id')",this.selectedFilledTags[0].hasOwnProperty('_id'));
      let formData = this.productSubmitForm.value;
      console.log('formData', formData);
      if (formData.product_name && formData.product_sku && formData.catagories_name && formData.product_price && formData.stock && formData.product_availability && formData.product_desc && (this.upload3DImage || this.imagelist.length > 0)) {
        let product_3dservice = 'inactive';
        if (formData.product_3dservice == true) {
          product_3dservice = 'active';
        }
        formData.product_3dservice = product_3dservice;

        let elink
        elink = formData.external_link;
        if (elink == null) {
          elink = ""
        }
        formData.external_link = elink;

        const newArrayImages = this.uploadImages.map(({ original_image, ...keepAttrs }) => keepAttrs)
        formData.product_image = newArrayImages;

        let threedImage = [
          {
            "_id": this.upload3DImageId,
            "pro_3d_image": this.upload3DImage,
            "pro_3d_image_name": (this.productglb_name) ? this.productglb_name : '',
            "status": "active"
          }
        ]
        formData.product_3d_image = threedImage;
        formData.product_id = this.productId;
        formData.upload_attribute_image = this.uploadAttributeImage
        formData.catagories_name = this.catagories_id
        formData.subcategories = this.subCategories;
        formData.product_meta_tags = this.metaTags;
        formData.brand_name = formData.brand_name._id ? formData.brand_name._id : this.selectedBrandId;
        if (formData.tag_List) {
          formData.tag_List = (this.selectedFilledTags[0].hasOwnProperty('_id')) ? this.selectedFilledTags : this.selectedTags
        }
        if (formData.is_custom_addons == true) {
          formData.is_addons_required = true;
        }

        let sale_price_avl = parseInt(formData.sale_price) ? parseInt(formData.sale_price) : 0
        if (parseInt(formData.product_price) > sale_price_avl) {
          console.log('Final product Update ------------------', formData);
          if (this.vendor_type !== "access") {
            this.productservice.updateProducts(formData).subscribe(
              res => {
                // console.log('Product Updated',res);  
                this.productinsertMessage = "Product Updated successfully";
                this.productinsertValid = true;

                /// settimeout Start
                const startTime = performance.now();
                this.ngZone.runOutsideAngular(() => {
                  const checkTime = (currentTime: number) => {
                    const elapsedTime = currentTime - startTime;
                    if (elapsedTime >= 2000) {
                      this.ngZone.run(() => {
                        this.router.navigate(['/products/product-list']);
                      });
                    } else {
                      requestAnimationFrame(checkTime);
                    }
                  };
                  requestAnimationFrame(checkTime);
                });
                /// settimeout End
              },
              error => {
                this.toaster.error(error.error.message)
              }
            );
          }
        }
        else {
          this.toaster.error("Sales price should be less than the regular product price.")
        }
      }
      else {
        this.toaster.error("Please fill all mandatory fields")
      }
    }
  }

  processFile(files: FileList, uploadfor) {
    this.fileToUpload = files.item(0);
    // console.log('File Selected' ,this.fileToUpload.name);


    // const reader = new FileReader();
    // let byteArray;

    // reader.addEventListener("loadend", () => {
    //   // convert image file to base64 string
    //   byteArray = this.convertDataURIToBinary(reader.result);
    //   // console.log('byte array =========> ', byteArray);
    // }, false);

    // if (this.fileToUpload) {
    //   reader.readAsDataURL(this.fileToUpload);
    // }

    this.productservice.uploadGlb(this.fileToUpload).subscribe(
      (res) => {
        // console.log('GLB Image Upload Sucess',res);
        if (uploadfor == 'website') {
          this.productglb_name = this.fileToUpload.name;
          this.upload3DImage = res['data'].fileUrl;
          this.upload3DImageId = res['data']._id
        }

        if (uploadfor == 'store') {
          this.productStoreglb_name = this.fileToUpload.name;
          this.upload3DImage_Store = res['data'].fileUrl;
          this.upload3DImage_StoreId = res['data']._id;
        }

        if (uploadfor == 'tryon') {
          this.productTryonglb_name = this.fileToUpload.name;
          this.upload3DImage_Tryon = res['data'].fileUrl;
          this.upload3DImage_TryonId = res['data']._id;
        }

      },
      error => {
        this.toaster.error(error.error.message)
      }
    )
  }

  public onUploadError(args: any): void {
    // console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    // console.log('onUploadSuccess:', args);
    if (args[1].error == 0) {
      // if(args[0].width == 400 && args[0].height == 400 && args[0].upload.total <= 5000000)
      // {
      let image_link = args[1].data.fileUrl
      let image_name = args[1].data.image_name.replace('product/', '');
      this.uploadImages.push({ "_id": args[1].data._id, "pro_image": image_link, "status": "active", "image_name": image_name, "original_image": args[0].upload.filename });
      //  }
      // else
      // {
      //   this.onDelete(args[0]);
      // }

      this.refreshdata();

    }


  }

  public removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value)) {

        arr.splice(i, 1);

      }
    }
    return arr;
  }

  public onDelete(args: any): void {
    // console.log('Delte product Image',args)

    // let product_imgs_name=this.uploadImages.reduce((prev,curr)=> (curr.original_image == args.upload.filename)?curr.image_name:prev,'');

    // let dpimgData={
    // image_name: product_imgs_name
    // }
    // // console.log('product_imgs_name',product_imgs_name)
    // // console.log('dpimgData',dpimgData)

    // this.productservice.deleteProductsImageServer(dpimgData).subscribe(
    // res =>
    // {
    // // console.log('Delte product',res)
    // this.removeByAttr(this.imagelist, 'original_image', args.upload.filename);
    // this.removeByAttr(this.uploadImages, 'original_image', args.upload.filename);

    // }
    // )
  }

  deleteProductImage(prd_img_id: any, prod_img_name, deleteType) {

    let dpimgData = {
      product_id: this.productId,
      image_id: prd_img_id,
      image_name: prod_img_name,
      image_type: deleteType
    }
    if (deleteType == 'prodimage') {
      if (this.uploadImages.length > 1) {
        this.productservice.deleteProductsImage(dpimgData).subscribe(
          res => {
            // console.log('Delte product',res)
            this.toaster.success('Image deleted successfully')
            this.removeByAttr(this.imagelist, 'image_name', prod_img_name);
            this.removeByAttr(this.uploadImages, 'image_name', prod_img_name);
          },
          error => {
            this.toaster.error(error.error.message)
          }
        )
      }
      else {
        this.toaster.error("Add more then one image to delete this image")
      }
    }
    else {
      this.productservice.deleteProductsImage(dpimgData).subscribe(
        res => {
          // console.log('Delte product',res)
          this.toaster.success('file deleted successfully')
          if (deleteType == 'tryon2d') {
            this.upload2DImage_TryonId = '';
            this.upload2DImage_Tryon = '';
            this.productTryon2d_name = '';
          }
          if (deleteType == 'store') {
            this.upload3DImage_Store = '';
            this.upload3DImage_StoreId = '';
            this.productStoreglb_name = '';
          }
          if (deleteType == 'tryon3d') {
            this.upload3DImage_Tryon = '';
            this.upload3DImage_TryonId = '';
            this.productTryonglb_name = '';
          }
          if (deleteType == 'threed') {
            this.upload3DImage = '';
            this.upload3DImageId = '';
            this.productglb_name = '';
          }
        },
        error => {
          this.toaster.error(error.error.message)
        }
      )
    }

  }

  getchild(catagory) {
    this.allSubcategorylist = [];
    this.subCategories = [];
    this.subcatagory = false;
    this.chieldSubcatagory = false;
    if (catagory.hasOwnProperty('_id')) {
      this.catagories_id = catagory._id;
      this.parentcategory = catagory;
    }
    this.productservice.allBrands(this.catagories_id).subscribe(
      res => {
        this.allBrandList = Array.isArray(res['data']) ? res['data'] : [];
      },
      error => {
        this.toaster.error(error.error.message)
      }
    );

    if (catagory.hasOwnProperty('category_id')) {
      this.catagories_id = catagory.category_id;
      this.parentcategory = this.findParentObject(this.mainCatagoriesLists, 'category_id', this.catagories_id)
    }

    this.clearAllSubCategories();

    // let categoryDetails = this.findCategoryId(this.catagoriesLists, this.catagories_id);
    if (this.parentcategory.child_categories.length > 0) {
      const formControlsConfig = { ...this.productSubmitForm.controls };
      let controlName = this.getFormControlName(catagory.category_name);
      formControlsConfig[controlName + '_subCat'] = new FormControl();
      this.productSubmitForm = this.formBuilder.group(formControlsConfig);
      let catObj =
      {
        "control_id": "1",
        "category_id": this.catagories_id,
        "child_category_id": catagory.category_id,
        "formcontrol_name": controlName + '_subCat'
      }
      this.subCategories.push(catObj)
      this.addChildCategories(this.parentcategory.child_categories, controlName + '_subCat', null, 1);
    }
    this.attributejsonData = this.parentcategory.attributes;
    this.addonsjsonData = this.parentcategory.addons;
    this.updateForm();
  }


  getSubchild(subcategory_id, control_id) {
    console.log('subcategory_id', subcategory_id, 'control_id', control_id);

    // Normalize control_id: If it starts with 'ctrl_', extract the number
    if (typeof control_id === 'string' && control_id.startsWith('ctrl_')) {
      control_id = control_id.replace('ctrl_', ''); // Remove 'ctrl_' prefix
    }
    let parentcategory1 = this.findNestedObj(this.mainCatagoriesLists, 'category_id', subcategory_id);
    let controlName1 = this.getFormControlName(parentcategory1.category_name);

    console.log('this.subCategories ================', this.subCategories)
    // Check if control_id exists in subCategories
    const index = this.subCategories.findIndex(item => item.control_id == control_id);
    console.log('index -------------------', index);
    if (index !== -1) {
      // Replace child_category_id with subcategory_id
      this.subCategories[index].child_category_id = subcategory_id;
      for (const sc of this.subCategories) {
        if (sc.control_id > control_id) {
          console.log('sc --------------------', sc)
          this.removeChildCategory(sc.formcontrol_name)
        }
      }
      // Check if there are any elements with control_id greater than this.control_id
      const filteredSubCategories = this.subCategories.filter(item => item.control_id <= control_id);
      // Update this.subCategories with filtered data
      this.subCategories = filteredSubCategories;
    }
    // Now, safely convert to number and increment
    control_id = +control_id + 1;
    let parentcategory = this.findNestedObj(this.mainCatagoriesLists, 'category_id', subcategory_id);
    if (parentcategory.hasOwnProperty('child_categories')) {
      if (parentcategory.child_categories.length > 0) {
        const formControlsConfig = { ...this.productSubmitForm.controls };
        let controlName = this.getFormControlName(parentcategory.category_name);
        formControlsConfig[controlName + '_subCat'] = new FormControl();
        this.productSubmitForm = this.formBuilder.group(formControlsConfig);
        let catObj =
        {
          "control_id": control_id,
          "category_id": this.catagories_id,
          "child_category_id": subcategory_id,
          "formcontrol_name": controlName1 + '_subCat'
        }
        this.subCategories.push(catObj)
        this.addChildCategories(parentcategory.child_categories, controlName + '_subCat', null, control_id);
      }
      this.updateForm();
    }
    console.log('this.subCategories ------------------', this.subCategories);

  }

  findParentObject = (json, keyToFind, targetId) => {
    for (let parent of json) {
      let isFound = this.findNestedObj(parent, keyToFind, targetId);
      if (isFound) {
        return parent;
      }
    }
    return null;
  }

  findNestedObj(entireObj, keyToFind, valToFind) {
    let foundObj = null;
    JSON.stringify(entireObj, (_, nestedValue) => {

      if (nestedValue && nestedValue[keyToFind] === valToFind) {
        foundObj = nestedValue;
      }
      return nestedValue;
    });
    return foundObj;
  }

  findNestedAllObj(data, key) {
    if (data.child_categories.findIndex(e => e.category_id == key) > -1) {
      return data;
    } else {
      for (let item of data.child_categories) {
        if (item.child_categories.findIndex(e => e.category_id == key) > -1) {
          return item;
        }
        if (item.child_categories && item.child_categories.length) {
          return this.findNestedAllObj(item, key);
        }
      }
    }

  }


  opengbl(content2) {
    this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  debounce(element, event, time = 200) {
    const eventObserver = fromEvent(this.productsku.nativeElement, 'keyup')
      .pipe(map((i: any) => i.currentTarget.value));
    return eventObserver.pipe(debounceTime(200));
  }

  refreshdata() {
    this.imagelist = this.uploadImages;
  }

  uploadFiles(files: FileList, formcontrolname) {
    this.fileToUpload = files.item(0);

    this.productservice.uploadImage(this.fileToUpload).subscribe(
      (res) => {
        if (formcontrolname == 'tryon') {
          this.upload2DImage_Tryon = res['data'].fileUrl;
          this.upload2DImage_TryonId = res['data']._id;
          this.productTryon2d_name = this.fileToUpload.name
        }
        else {
          let imgobj = {
            keyname: formcontrolname,
            fileUrl: res['data'].fileUrl,
          };
          this.uploadAttributeImage.push(imgobj);
        }

      },
      error => {
        this.toaster.error(error.error.message)
      }
    )
    // }
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
        this.onProductupdate();
      }
    }
  }

  onFileAdded(file: File) {
    // console.log('File added manually:', file);

    this.productservice.uploadImage(file).subscribe({
      next: (res) => {
        this.onUploadSuccess([file, res]); 
      },
      error: (err) => {
        console.error('Manual upload error', err);
      }
    });
  }


}
