import { ToastrService } from 'ngx-toastr';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import '@google/model-viewer';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CatagoriesService } from '../../catagories/catagories.service';
import { TimingService } from 'src/app/timing.service';
import { TagService } from '../tag.service';



@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})



export class AddTagComponent implements OnInit {

  userrole: any;
  isAdmin: boolean = false;
  taginsertValid: boolean = false;
  taginsertinValid: boolean = false;
  taginsertMessage: any
  uploadfrom: string = 'tag';
  public tagSubmitForm: FormGroup;
  closeResult = '';
  tag_image_name: any
  uploadTagImages: any;
  tagProductJson: any;
  tagname: any
  invalidForm: boolean = false;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public tagservice: TagService, private router: Router, private toastrService: ToastrService, private catagoriesservice: CatagoriesService,private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    // console.log(localStorage.getItem('user_token'));
    this.tagSubmitForm = new FormGroup({
      'tag_name': new FormControl(null, [Validators.required]),
      'tag_desc': new FormControl(null, [Validators.required]),
      'web_view_status': new FormControl(false) // Default to false (inactive)
    });
  }


  // Create Room
  get tag_name() { return this.tagSubmitForm.get('tag_name') }
  get tag_desc() { return this.tagSubmitForm.get('tag_desc') }

  onTagSubmit() {

    if (this.tagSubmitForm.invalid) {
      this.tagSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.tagSubmitForm.value;

    if (this.tagSubmitForm.invalid) {
      return;
    }
    let jsondata = {};

    jsondata =
    {
      "tag_name": formData.tag_name,
      "tag_description": formData.tag_desc,
      "tag_image": this.uploadTagImages,
      "tag_image_name": this.tag_image_name,
      "web_view_status": formData.web_view_status ? 'active' : 'inactive'
    }
    console.log('Tag Submit Data =============', jsondata);

    this.tagservice.singleTagAdd(jsondata).subscribe(
      res => {
        this.taginsertMessage = "Tag Added successfully";
        this.taginsertValid = true;

          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigateByUrl('/SidebarComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['/tag/list-tag']);
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
      this.tag_image_name = file.name;
      const img = new Image();
      img.onload = () => {
        //   // total: 2256862
        // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
        // {
        this.tagservice.uploadImage(file).subscribe(
          (res) => {
            // console.log('Image Upload Sucess',res);
            this.uploadTagImages = res['data'].fileUrl;
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
        this.onTagSubmit();
      }
    }
  }

}
