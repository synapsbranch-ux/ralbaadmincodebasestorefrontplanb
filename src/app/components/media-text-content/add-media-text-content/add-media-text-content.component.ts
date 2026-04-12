import { ToastrService } from 'ngx-toastr';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import '@google/model-viewer';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MediaTextContentService } from '../media-text-content.service';



@Component({
  selector: 'app-add-media-text-content',
  templateUrl: './add-media-text-content.component.html',
  styleUrls: ['./add-media-text-content.component.scss']
})

export class AddMediaTextContentComponent implements OnInit {

  userrole: any;
  isAdmin: boolean = false;
  mediainsertValid: boolean = false;
  mediainsertinValid: boolean = false;
  mediainsertMessage: any
  public addMediaSubmitForm: FormGroup;
  closeResult = '';
  section_image_name: any;
  uploadMediaTextContaintImages: any;
  mediaProductJson: any;
  medianame: any
  invalidForm: boolean = false;
  tagList: any[] = [];

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public mediaService: MediaTextContentService, private router: Router, private toastrService: ToastrService,private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    // console.log(localStorage.getItem('user_token'));
    this.addMediaSubmitForm = new FormGroup({
      'heading_text': new FormControl(null, [Validators.required]),
      'description_text': new FormControl(null, [Validators.required]),
      'tag_List': new FormControl(null),
    });

    // Fetch available tags (same as products)
    this.mediaService.allTaglist().subscribe(
      res => {
        this.tagList = Array.isArray(res['data']) ? res['data'] : [];
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }


  // Create Room
  get heading_text() { return this.addMediaSubmitForm.get('heading_text') }
  get description_text() { return this.addMediaSubmitForm.get('description_text') }

  onMediaTextSubmit() {
    if (this.addMediaSubmitForm.invalid) {
      this.addMediaSubmitForm.markAllAsTouched();
      return;
    }
    let formData = this.addMediaSubmitForm.value;
    if (this.addMediaSubmitForm.invalid) {
      return;
    }
    let jsondata = {};

    jsondata =
    {
      "heading_text": formData.heading_text,
      "description_text": formData.description_text,
      "section_image": this.uploadMediaTextContaintImages,
      "section_image_name": this.section_image_name,
      // keep key name same as products implementation
      "tag_List": formData.tag_List
    }
    console.log('Media Text Content Submit Data =============', jsondata);

    this.mediaService.singleMediaTextContentAdd(jsondata).subscribe(
      res => {
        this.mediainsertMessage = "Media Text Content Added successfully";
        this.mediainsertValid = true;

          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['/media-text-content/list-media-text-content']);
                  });
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
        this.toastrService.error(error.error.message)
      }
    );
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
        this.mediaService.uploadImage(file).subscribe(
          (res) => {
            // console.log('Image Upload Sucess',res);
            this.uploadMediaTextContaintImages = res['data'].fileUrl;
          },
          error => {
            this.toastrService.error(error.error.message)
          })

      };
      img.src = URL.createObjectURL(file);
    }
  }

  public onUploadError(args: any): void {
  }

  public onUploadSuccess(args: any): void {
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
        this.onMediaTextSubmit();
      }
    }
  }

}
