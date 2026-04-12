import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MediaTextContentService } from '../media-text-content.service';

@Component({
  selector: 'app-edit-media-text-content',
  templateUrl: './edit-media-text-content.component.html',
  styleUrls: ['./edit-media-text-content.component.scss']
})
export class EditMediaTextContentComponent implements OnInit {
  mediainsertValid: boolean = false;
  mediainsertMessage: any

  medianame: any;
  mediaslug: any;
  description_text: any;
  medialocation: any;
  vendor_id: any;
  media_descs: any;
  userrole: any;
  isAdmin: boolean = false;
  updatejson: any;
  public mediaSubmitForm: FormGroup;
  closeResult = '';
  private fileToUpload: File = null;
  section_image_name: any
  section_image: any
  upload3DImage = [];
  invalidForm: boolean = false;
  media_slug: any
  desableaddRooom: boolean = true;
  tagList: any[] = [];
  selectedFilledTags: any;
  selectedTags: any;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public mediaService: MediaTextContentService, private route: ActivatedRoute, private router: Router, private toster: ToastrService, private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

    this.mediaSubmitForm = new FormGroup({
      'heading_text': new FormControl(null, [Validators.required]),
      'media_desc': new FormControl(null, [Validators.required]),
      'tag_List': new FormControl(null),
    });



    if (this.userrole == 'admin') {
      this.mediaService.allTaglist().subscribe(
        res => {
          this.tagList = Array.isArray(res['data']) ? res['data'] : [];
        },
        error => {
          this.toster.error(error.error.message)
        }
      );
      let media_text_contain_id_Obj =
      {
        "media_text_contain_id": this.route.snapshot.paramMap.get('id')
      }

      this.mediaService.singleMediaTextContentDetails(media_text_contain_id_Obj).subscribe(
        res => {
          this.medianame = res['data'].heading_text;
          this.description_text = res['data'].description_text;
          this.section_image = res['data'].section_image;
          this.selectedTags = res['data'].tags;
          if (this.section_image) {
            this.section_image_name = res['data'].section_image_name;
          }
          if (res['data'] && this.selectedTags) {
            // Extract brand names from top_brands
            this.selectedFilledTags = this.selectedTags.map(iterator => iterator.tag_name);
            console.log('this.selectedFilledTags', this.selectedFilledTags);
          }
        },
        error => {
          this.toster.error(error.error.message)
        });
    }

    if (this.userrole == 'vendor') {
      this.mediaService.vendorallTaglist().subscribe(
        res => {
          this.tagList = Array.isArray(res['data']) ? res['data'] : [];
        },
        error => {
          this.toster.error(error.error.message)
        }
      );
      let media_text_contain_id_Obj =
      {
        "media_text_contain_id": this.route.snapshot.paramMap.get('id')
      }

      this.mediaService.singleVendorMediaTextContentDetails(media_text_contain_id_Obj).subscribe(
        res => {
          this.medianame = res['data'].heading_text;
          this.description_text = res['data'].description_text;
          this.section_image = res['data'].section_image;
          this.selectedTags = res['data'].tags;
          if (this.section_image) {
            this.section_image_name = res['data'].section_image_name;
          }
          // if (res['data'] && res['data'].tag_List) {
          //   this.mediaSubmitForm.get('tag_List')?.setValue(res['data'].tag_List);
          // }
          if (res['data'] && this.selectedTags) {
            // Extract brand names from top_brands
            this.selectedFilledTags = this.selectedTags.map(iterator => iterator.tag_name);
            console.log('this.selectedFilledTags', this.selectedFilledTags);
          }
        },
        error => {
          this.toster.error(error.error.message)
        });
    }
  }


  // Create Room
  get heading_text() { return this.mediaSubmitForm.get('heading_text') }
  get media_desc() { return this.mediaSubmitForm.get('media_desc') }

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
  onSelectionChange(fieldName: string, event: any) {
    // Update form control with the latest selection
    this.mediaSubmitForm.get(fieldName)?.setValue(event);
  }
  onMediaTextEdit() {
    if (this.mediaSubmitForm.invalid) {
      this.mediaSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.mediaSubmitForm.value;

    if (this.userrole == 'admin') {
      if (formData.tag_List) {
        formData.tag_List = (this.selectedFilledTags[0].hasOwnProperty('_id')) ? this.selectedFilledTags : this.selectedTags
      }
      this.updatejson =
      {
        'media_text_contain_id': this.route.snapshot.paramMap.get('id'),
        "heading_text": formData.heading_text,
        "section_image": this.section_image,
        "section_image_name": this.section_image_name,
        "description_text": formData.media_desc,
        "tag_List": formData.tag_List
      }
      console.log('this.updatejson', this.updatejson)
      this.mediaService.singleMediaTextContentUpdate(this.updatejson).subscribe(
        res => {
          this.mediainsertMessage = "Media Text Contain Updated successfully";
          this.mediainsertValid = true;
          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigate(['/media-text-content/list-media-text-content']);
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
          // console.log(error.message);
          this.toster.error(error.error.message)
        }
      );

    }
    if (this.userrole == 'vendor') {
      this.updatejson =
      {
        'media_text_contain_id': this.route.snapshot.paramMap.get('id'),
        "heading_text": formData.heading_text,
        "section_image": this.section_image,
        "section_image_name": this.section_image_name,
        "description_text": formData.media_desc,
        "tag_List": formData.tag_List
      }
      console.log('this.updatejson', this.updatejson)
      this.mediaService.singleVendorMediaTextContentUpdate(this.updatejson).subscribe(
        res => {
          this.mediainsertMessage = "Media Text Contain Updated successfully";
          this.mediainsertValid = true;
          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigate(['/media-text-content/list-media-text-content']);
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
          // console.log(error.message);
          this.toster.error(error.error.message)
        }
      );
    }
  }

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,

    accept: (file, done) => {
      this.onAccept(file, done);
    },

  };


  onAccept(ev: any, done: Function) {
    if (ev) {
      // console.log('Uplad File', ev)
      const file = ev;
      this.section_image_name = file.name;
      const img = new Image();
      img.onload = () => {
        //   // total: 2256862
        // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
        // {
        if (this.userrole == 'admin') {
          this.mediaService.uploadImage(file).subscribe(
            (res) => {
              // console.log('Image Upload Sucess',res);
              this.section_image = res['data'].fileUrl;
            },
            error => {
              this.toster.error(error.error.message)
            })
        }
        if (this.userrole == 'vendor') {
          this.mediaService.uploadVendorImage(file).subscribe(
            (res) => {
              // console.log('Image Upload Sucess',res);
              this.section_image = res['data'].fileUrl;
            },
            error => {
              this.toster.error(error.error.message)
            })
        }

      };
      img.src = URL.createObjectURL(file);
    }
  }

  public onUploadError(args: any): void {
  }

  public onUploadSuccess(args: any): void {
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
        this.onMediaTextEdit();
      }
    }
  }

}
