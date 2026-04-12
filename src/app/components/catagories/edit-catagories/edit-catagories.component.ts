import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CatagoriesService } from '../catagories.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-catagories',
  templateUrl: './edit-catagories.component.html',
  styleUrls: ['./edit-catagories.component.scss']
})
export class EditCatagoriesComponent implements OnInit {


  uploadcatagoryImages: any;
  uploadcatagoryImagesName: any;
  userrole: any;
  isAdmin: boolean = false;
  catagoriesinsertValid: boolean = false;
  catagoriesinsertinValid: boolean = false;
  catagoriesinsertMessage: any
  public catagoriesSubmitForm: FormGroup;
  closeResult = '';
  storeLists = [];
  departmentLists = [];
  attributejsonData = [];
  addonsjsonData = [];
  category_name: any;
  attribute_json_file_name: any;
  addons_json_file_name: any;
  category_image_name: any;

  constructor(private sanitizer: DomSanitizer, private modalService: NgbModal, private formBuilder: FormBuilder, public catagoriesservice: CatagoriesService, private router: Router, private toastrService: ToastrService, private route: ActivatedRoute, private ngZone: NgZone) {
  }


  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.catagoriesSubmitForm = new FormGroup({
      'catagories_name': new FormControl(null, [Validators.required])

    });

    let catgegories_object = {
      "category_id": this.route.snapshot.paramMap.get('id')
    }

    this.catagoriesservice.singleCatagoriesDetails(catgegories_object).subscribe(
      res => {
        this.category_name = res.data[0].category_name;
        this.attributejsonData = res.data[0].attributes;
        this.addonsjsonData = res.data[0].addons;
        this.uploadcatagoryImages = res.data[0].category_image;
        this.category_image_name = res.data[0].category_image_name;
        this.attribute_json_file_name = res.data[0].attributes_json_name;
        this.addons_json_file_name = res.data[0].add_ons_json_name;
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    )


  }


  // Function to sanitize a single URL using DomSanitizer
  sanitizeURL(url: string): SafeResourceUrl {
    let urlYoutube = url.replace("watch?v=", "v/");
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlYoutube);
  }

  // Create Room
  get catagories_name() { return this.catagoriesSubmitForm.get('catagories_name'); }


  onCatagoriesSubmit() {
    let formData = this.catagoriesSubmitForm.value;

    if (this.catagoriesSubmitForm.invalid) {
      return;
    }
    let jsondata = {};
    // if(this.uploadcatagoryImages)
    // {
    jsondata =
    {
      "category_id": this.route.snapshot.paramMap.get('id'),
      "category_name": formData.catagories_name,
      "category_image": this.uploadcatagoryImages,
      "category_image_name": this.category_image_name,
      "child_categories": [],
      "add_ons": this.addonsjsonData.length > 0 ? this.addonsjsonData : [],
      "add_ons_json_name": this.addons_json_file_name,
      "attributes": this.attributejsonData.length > 0 ? this.attributejsonData : [],
      "attributes_json_name": this.attribute_json_file_name
    }
    this.catagoriesservice.updateCatagories(jsondata).subscribe(
      res => {
        this.catagoriesinsertMessage = "Categories Updated successfully";
        this.catagoriesinsertValid = true;
        /// settimeout Start
        const startTime = performance.now();
        this.ngZone.runOutsideAngular(() => {
          const checkTime = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= 2000) {
              this.ngZone.run(() => {
                this.router.navigate(['/categories/list-categories']);
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
        this.toastrService.error(error.error.message)
      }
    );
    // }
    // else
    // {
    // this.catagoriesinsertMessage="Image Upload Failed. Please Check Image Upload Guideline";
    // this.catagoriesinsertValid = false;
    // this.catagoriesinsertinValid= true;
    // }


  }

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
  };

  public onUploadError(args: any): void {
    // console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    if (args[1].error == 0) {
      // if(args[0].width == 400 && args[0].height == 400 && args[0].upload.total <= 5000000)
      // {
      this.category_image_name = args[0].name;
      let image_link = args[1].data.fileUrl
      let image_name = args[1].data.image_name.replace('catagories/', '');
      this.uploadcatagoryImages = image_link;
      this.uploadcatagoryImagesName = image_name;

      // console.log('Department image link',this.uploadDepartmentImages);
      // console.log('Department image name',this.uploadDepartmentImagesName);
      //  }
      // else
      // {
      //   this.onDelete(args[0]);
      // }

    }

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

  uploadOnChange(event: any, type: boolean) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const contents = e.target.result;
      if (type) {
        let att_temp_arr = JSON.parse(contents);
        if (att_temp_arr[0].hasOwnProperty('attribute_input') && att_temp_arr[0].hasOwnProperty('attribute_name') && att_temp_arr[0].hasOwnProperty('attribute_value') && att_temp_arr[0].hasOwnProperty('is_mandatory')) {
          this.attribute_json_file_name = file.name;
          this.attributejsonData = JSON.parse(contents);
        } else if (att_temp_arr[0]) {
          this.attributejsonData = [];
        }
        else {
          this.toastrService.error('Pleasee Upload a Valid Attribute JSON')
        }

        console.log('this.attributejsonData ======================>', this.attributejsonData);
      }
      else {
        let addon_temp_arr = JSON.parse(contents);
        if (addon_temp_arr[0].hasOwnProperty('add_ons_input') && addon_temp_arr[0].hasOwnProperty('add_ons_level') && addon_temp_arr[0].hasOwnProperty('add_ons_name') && addon_temp_arr[0].hasOwnProperty('add_ons_value') && addon_temp_arr[0].hasOwnProperty('is_mandatory')) {
          this.addons_json_file_name = file.name;
          this.addonsjsonData = JSON.parse(contents);
        }
        else if (addon_temp_arr[0]) {
          this.addonsjsonData = [];
        }
        else {
          this.toastrService.error('Pleasee Upload a Valid Add-Ons JSON')
        }

        console.log('this.addonsjsonData ======================>', this.addonsjsonData);

      }

    };

    reader.readAsText(file);
  }

  isInputType(input: string): boolean {
    return input === 'input';
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
        this.onCatagoriesSubmit();
      }
    }
  }



  onFileAdded(file: File) {
    // console.log('File added manually:', file);

    this.catagoriesservice.uploadImage(file).subscribe({
      next: (res) => {
        this.onUploadSuccess([file, res]);
      },
      error: (err) => {
        console.error('Manual upload error', err);
      }
    });
  }

}
