import { first, debounceTime, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from "../product.service";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { fromEvent, Subscription } from 'rxjs';
import '@google/model-viewer';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductAddComponent implements OnInit, OnDestroy {

  public productSubmitForm: FormGroup;

  sizeVeriationFormArray: Array<any> = [];
  ColorVeriationFormArray: Array<any> = [];
  sizeVerientId: any
  colorVerientId: any
  percentDone: number;
  userrole: any;
  isAdmin: boolean = false;
  subcatagory: boolean = false;
  chieldSubcatagory: boolean = false;
  departmentLists = [];
  storeLists = [];
  catagoriesLists = [];
  allCatagoriesLists = [];
  mainCatagoriesLists = [];
  varientList = [];
  tagList = [];
  productinsertValid: boolean = false;
  productinsertError: boolean = false;
  productinsertMessage: any
  private fileToUpload: File = null;
  uploadImages = [];
  upload3DImage = [];
  upload3DImageStatus: string = '';
  uploadImageStatus: string = '';
  itemadd_left: number;
  itemadd_left_status: boolean = false;
  closeResult = '';
  size_arr = [];
  imagelist = [];
  delete_product_id: any;
  delete_product_img_id: any;
  productglb_name: any
  catagories_id: any;
  attributejsonData: any;
  addonsjsonData: any;
  attribute_length: any;
  addons_length: any;
  category_json: any;
  subcategories: any
  uploadAttributeImage = []
  customAddonService: boolean = false;
  AddonService: boolean = false;
  parentcategory: any
  allBrandList = [];
  selectedBrand: any;
  subCategories = [];
  metaTags: string[] = [];
  afterAttributefieldcount: number = 0;
  firstStaticFieldLastIndex: number = 7;
  addOnStartIndex: number = 0;
  lastStaticFieldStarIndex: number = 0;

  @ViewChild('contentSubCategories', { static: true }) contentSubCategories: ElementRef;
  @ViewChild('productsku', { static: true }) productsku: ElementRef;
  @ViewChild('productsale', { static: true }) productsale: ElementRef;
  private inputSubscription: Subscription;

  skuvaluecount: any
  selectedCategory: any;
  vendor_type: any
  requestButton: boolean = false;
  constructor(private modalService: NgbModal, private ngZone: NgZone, private formBuilder: FormBuilder, public productservice: ProductService, private router: Router, private toaster: ToastrService) {
  }

  ngOnInit() {
    this.vendor_type = localStorage.getItem("vendor_type")
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.createForm();
    let data2 = {
      'page': 1,
      'limit': 10
    }
    this.productservice.allStores(data2).subscribe(
      res => {
        // console.log('All Store ===== ',res);
        this.storeLists = res['data'];
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )

    this.productservice.allDepartment().subscribe(
      res => {
        this.departmentLists = res['data'];
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )

    this.productservice.allCatagories().subscribe(
      res => {
        this.mainCatagoriesLists = res['data'];
        this.allCatagoriesLists = Array.isArray(res['data']) ? res['data'] : [];
        // console.log('Categories List ===================>', this.allCatagoriesLists)
      },
      error => {
        this.toaster.error(error.error.message)
      }
    );
    this.productservice.allVarientlist().subscribe(
      res => {
        this.varientList = res['data'];
        for (const [index, element] of this.varientList.entries()) {
          if (index == 0) {
            this.sizeVerientId = element._id
          }
          if (index == 1) {
            this.colorVerientId = element._id
          }
        }
        // console.log('Veriation Lists ==== ',res['data']);
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )
    this.productservice.allTaglist().subscribe(
      res => {
        this.tagList = res['data'];
      },
      error => {
        this.toaster.error(error.error.message)
      }
    );

    this.ngZone.runOutsideAngular(() => {
      this.inputSubscription = this.debounce(this.productsku, 2000).subscribe(value => {
        console.log('Debounced SKU Value after 2 seconds:', value);
        this.searchproductsku(value);  // Trigger search after 2-second delay
      });

      // Subscribe to the debounced input event for product sale
      this.debounceSale(this.productsale, 2000).subscribe(value => {
        console.log('Debounced Sale Value after 2 seconds:', value);
        this.salePricekeyPress(value);  // Trigger sale price logic after 2-second delay
      });
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

  ngOnDestroy() {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }

  deleteProductImage(prod_img_name, deleteType) {

    let dpimgData = {
      image_name: prod_img_name,
      image_type: deleteType
    }
    if (deleteType == 'prodimage') {
      if (this.uploadImages.length > 1) {
        this.productservice.deleteProductsImageServer(dpimgData).subscribe(
          res => {
            // console.log('Delte product',res)
            this.toaster.success('Image deleted successfully')
            console.log('this.imagelist', this.imagelist);
            console.log('this.uploadImages', this.uploadImages);
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
      this.productservice.deleteProductsImageServer(dpimgData).subscribe(
        res => {
          this.toaster.success('file deleted successfully')
          if (deleteType == 'threed') {
            this.upload3DImage = [];
            this.productglb_name = '';
          }
        },
        error => {
          this.toaster.error(error.error.message)
        }
      )
    }

  }

  request3DAsset() {
    let formData = this.productSubmitForm.value;

    let userDeatil = JSON.parse(localStorage.getItem('currentUser'));
    let Obj =
    {
      vendor_type: this.vendor_type,
      product_name: formData.product_name,
      vendor_name: userDeatil.name,
      vendor_id: userDeatil.vendor_id,
    }
    if (!this.requestButton) {
      if (formData.product_name) {
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

  addChildCategories(allCatagoriesLists, formcontrolname, selected_val, control_id) {
    // Prefix the control_id with 'ctrl_' to make it valid
    const prefixedControlId = `ctrl_${control_id}`;

    // First, remove the existing subcategory if it exists
    const existingSelectElement = this.contentSubCategories.nativeElement.querySelector(`#${prefixedControlId}`);
    if (existingSelectElement) {
      existingSelectElement.remove();
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
    this.contentSubCategories.nativeElement.appendChild(selectElement);
  }



  removeChildCategory(formControlName: string) {
    // Remove the control from the form group
    this.productSubmitForm.removeControl(formControlName);

    // Remove the select element from the DOM
    const selectElement = this.contentSubCategories.nativeElement.querySelector(`[formControlName="${formControlName}"]`);
    if (selectElement) {
      selectElement.remove();
    }
  }


  // Currently Not Use  It's main work it can brake category, sub category, child with '-' sign
  flatcategories = (data, result, depth) => {
    let str = '';
    for (let i = 0; i <= depth; i++) { str += '-' }

    result.push({ ...data });
    if (data.child_categories && data.child_categories.length) {
      let i = 0;
      while (i < data.child_categories.length) {
        data.child_categories[i].category_name = str + data.child_categories[i].category_name;
        this.flatcategories(data.child_categories[i], result, (depth + 1));
        i++;
      }
    }
    return result;
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

  updateForm() {
    const formControlsConfig = { ...this.productSubmitForm.controls };
    if (this.attributejsonData) {
      for (const item of this.attributejsonData) {
        const controlName = item.attribute_name.includes(' ')
          ? item.attribute_name.toLowerCase()
            .replace(/ /g, '_')
            .replace(/[^\w-]+/g, '')
          : item.attribute_name.toLowerCase();
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

  }

  searchproductsku(data: any) {
    let SKUData =
    {
      product_sku: data
    }

    this.productservice.searchProductSKU(SKUData).subscribe(
      res => {
        this.skuvaluecount = res.data
        //console.log('SkU Find Status',res.data)
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )

  }

  isInputType(input: string): boolean {
    return input === 'input';
  }

  getFormControlName(name: string): string {
    return name.toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '');
  }

  salePricekeyPress(event: any) {
    this.productSubmitForm.controls['product_price'].enable();
    let productPriceElement = document.getElementById('product_price') as HTMLInputElement;
    if (productPriceElement) {
      let productprice = productPriceElement.value;
      if (event > Number(productprice)) {
        this.toaster.error('Sales price should be less than the regular product price.');
      }
    } else {
      console.error('Product price element not found');
    }
  }


  public removeByAttr = function (arr: any[], attr: string, value: any) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] && arr[i][attr] === value) {
        arr.splice(i, 1);
      }
    }
    return arr;
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
    moveItemInArray(this.uploadImages, event.previousIndex, event.currentIndex);

  }
  onProductSubmit(): void {
    let formData = this.productSubmitForm.value;
      console.log('product_meta_tags =============', this.metaTags);
    // console.log('formData---------------', formData);

    if (formData.brand_name && formData.product_name && formData.product_sku && formData.catagories_name && formData.product_price && formData.stock && formData.product_availability && formData.product_desc && (this.upload3DImage.length > 0 || this.uploadImages.length > 0)) {

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
          "_id": (this.upload3DImage.length > 0) ? this.upload3DImage[0]._id : '',
          "pro_3d_image": (this.upload3DImage.length > 0) ? this.upload3DImage[0].fileurl : '',
          "pro_3d_image_name": (this.productglb_name) ? this.productglb_name : '',
          "status": "active"
        }
      ]
      formData.product_3d_image = threedImage;
      formData.product_tryon_2d_image = [];
      formData.product_store_3d_image = [];
      formData.product_tryon_3d_image = [];
      formData.upload_attribute_image = this.uploadAttributeImage
      formData.catagories_name = this.catagories_id;
      formData.brand_name = formData.brand_name._id;
      formData.subcategories = this.subCategories;
      formData.product_meta_tags = this.metaTags;
      if (formData.is_custom_addons == true) {
        formData.is_addons_required = true;
      }

      let sale_price_avl = parseInt(formData.sale_price) ? parseInt(formData.sale_price) : 0
      if (parseInt(formData.product_price) > sale_price_avl) {
        console.log('final submission Product data =============', formData)
        console.log('product_meta_tags =============', formData.product_meta_tags);
        this.productservice.addProducts(formData).subscribe(
          res => {
            this.productinsertMessage = "Product Insert successfully";
            this.productinsertValid = true;
            this.productSubmitForm.reset();

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
            // .... HANDLE ERROR HERE 
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
        this.onProductSubmit();
      }
    }
  }

  processFile(files: FileList) {
    this.fileToUpload = files.item(0);
    // console.log('File Selected' ,this.fileToUpload);
    // console.log('File Selected' ,this.fileToUpload.size);
    this.productglb_name = this.fileToUpload.name;
    // // console.log(filename.replace('https://ralbaassetstorage.s3.us-east-2.amazonaws.com/product/',''))
    this.upload3DImageStatus = 'uploading';

    // if(this.fileToUpload.size <= 2000000)
    // {
    this.productservice.uploadGlb(this.fileToUpload).subscribe(
      (res) => {
        // console.log('GLB Image Upload Sucess',res);
        this.upload3DImage = [{
          _id: res['data']._id,
          fileurl: res['data'].fileUrl,
        }];
        this.upload3DImageStatus = 'uploaded';
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )
    // }

  }

  uploadFiles(files: FileList, formcontrolname) {
    this.fileToUpload = files.item(0);

    this.productservice.uploadImage(this.fileToUpload).subscribe(
      (res) => {
        let imgobj = {
          keyname: formcontrolname,
          fileUrl: res['data'].fileUrl,
        };
        this.uploadAttributeImage.push(imgobj);
      },
      error => {
        this.toaster.error(error.error.message)
      }
    )
    // }
  }


  public convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  public onUploadError(args: any): void {
    // console.log('onUploadError:', args);
  }


  public onUploadSuccess(args: any): void {
    if (args[1].error === 0) {
      const imageData = args[1].data;

      const image_link = imageData.fileUrl;
      const image_name = imageData.image_name.replace('product/', '');
      const image_id = imageData._id;
      const original_name = image_name; // safer to assume from image_name

      const newImage = {
        _id: image_id,
        pro_image: image_link,
        status: "active",
        image_name: image_name,
        original_image: original_name // use image_name, not args[0].upload.filename
      };

      const existingIndex = this.uploadImages.findIndex(img => img._id === image_id);

      if (existingIndex !== -1) {
        this.uploadImages[existingIndex] = newImage;
      } else {
        this.uploadImages.push(newImage);
      }
    }

    this.refreshdata();
  }


  public onDelete(args: any): void {
    let product_imgs_name = this.uploadImages.reduce((prev, curr) => (curr.original_image == args.upload.filename) ? curr.image_name : prev, '');

    let dpimgData = {
      image_name: product_imgs_name
    }
  }

  getchild(catagory) {
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
    // let categoryDetails = this.findCategoryId(this.catagoriesLists, this.catagories_id);
    if (this.parentcategory.child_categories.length > 0) {
      const formControlsConfig = { ...this.productSubmitForm.controls };
      let controlName = this.getFormControlName(catagory.category_name);
      formControlsConfig[controlName + '_subCat'] = new FormControl();
      this.productSubmitForm = this.formBuilder.group(formControlsConfig);
      let catObj =
      {
        "control_id": 1,
        "category_id": this.catagories_id,
        "child_category_id": catagory.category_id,
        "formcontrol_name": controlName + '_subCat'
      }
      this.subCategories.push(catObj)
      this.addChildCategories(this.parentcategory.child_categories, controlName + '_subCat', null, 1);
    }
    this.attributejsonData = this.parentcategory.attributes;
    this.attribute_length = this.attributejsonData.length;
    this.addonsjsonData = this.parentcategory.addons;
    this.addons_length = this.attributejsonData.length;
    this.afterAttributefieldcount = (this.firstStaticFieldLastIndex + this.attribute_length);
    this.addOnStartIndex = this.afterAttributefieldcount + 3;
    this.lastStaticFieldStarIndex = this.addOnStartIndex + this.addons_length;
    this.updateForm();
  }

  getSubchild(subcategory_id, control_id) {

    let parentcategory1 = this.findNestedObj(this.mainCatagoriesLists, 'category_id', subcategory_id);
    let controlName1 = this.getFormControlName(parentcategory1.category_name);
    // Check if control_id exists in subCategories
    const index = this.subCategories.findIndex(item => item.control_id == control_id);

    if (index !== -1) {
      // Replace child_category_id with subcategory_id
      this.subCategories[index].child_category_id = subcategory_id;
      for (const sc of this.subCategories) {
        if (sc.control_id > control_id) {
          this.removeChildCategory(sc.formcontrol_name)
        }
      }
      // Check if there are any elements with control_id greater than this.control_id
      const filteredSubCategories = this.subCategories.filter(item => item.control_id <= control_id);
      // Update this.subCategories with filtered data
      this.subCategories = filteredSubCategories;
    } else {
      let catObj =
      {
        "control_id": control_id,
        "category_id": this.catagories_id,
        "child_category_id": subcategory_id,
        "formcontrol_name": controlName1 + '_subCat'
      }
      this.subCategories.push(catObj)
    }
    control_id = +control_id + 1
    let parentcategory = this.findNestedObj(this.mainCatagoriesLists, 'category_id', subcategory_id);
    if (parentcategory.hasOwnProperty('child_categories')) {
      if (parentcategory.child_categories.length > 0) {
        const formControlsConfig = { ...this.productSubmitForm.controls };
        let controlName = this.getFormControlName(parentcategory.category_name);
        formControlsConfig[controlName + '_subCat'] = new FormControl();
        this.productSubmitForm = this.formBuilder.group(formControlsConfig);
        this.addChildCategories(parentcategory.child_categories, controlName + '_subCat', null, control_id);
      }
      this.updateForm();
    }
    // console.log('this.subCategories ------------------', this.subCategories);
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

  findCategoryId = (json, targetId) => {
    for (let i = 0; i < json.length; i++) {
      const category = json[i];
      if (category._id === targetId) {
        return category;
      } else if (category.child_categories.length > 0) {
        const result = this.findChildCategoryId(category.child_categories, targetId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  findChildCategoryId = (json, targetId) => {
    for (let i = 0; i < json.length; i++) {
      const category = json[i];
      if (category.category_id === targetId) {
        return category;
      } else if (category.child_categories.length > 0) {
        const result = this.findChildCategoryId(category.child_categories, targetId);
        if (result) {
          return result;
        }
      }
    }
    return null;
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


  // Debounce for product SKU with 2-second delay
  debounce(element, time = 2000) {
    return fromEvent(element.nativeElement, 'keyup').pipe(
      debounceTime(time),  // 2-second debounce time
      map((event: any) => event.target.value)
    );
  }

  // Debounce for product sale with 2-second delay
  debounceSale(element, time = 2000) {
    return fromEvent(element.nativeElement, 'keyup').pipe(
      debounceTime(time),  // 2-second debounce time
      map((event: any) => event.target.value)
    );
  }


  refreshdata() {
    this.imagelist = this.uploadImages;
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
