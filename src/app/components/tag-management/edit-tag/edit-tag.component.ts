import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CatagoriesService } from '../../catagories/catagories.service';
import { TimingService } from 'src/app/timing.service';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent implements OnInit {
  taginsertValid: boolean = false;
  taginsertMessage: any

  tagname: any;
  tagslug: any;
  tagdesc:any;
  taglocation: any;
  vendor_id: any;
  tag_descs: any;
  userrole: any;
  isAdmin: boolean = false;
  updatejson: any;
  public tagSubmitForm: FormGroup;
  closeResult = '';
  private fileToUpload: File = null;
  tag_image_name: any
  tag_image: any
  upload3DImage = [];
  invalidForm: boolean = false;
  tag_slug: any
  desableaddRooom: boolean = true;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public tagservice: TagService, private route: ActivatedRoute, private router: Router, private toster: ToastrService, private catagoriesservice: CatagoriesService,private ngZone: NgZone) {
  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

    this.tagSubmitForm = new FormGroup({
      'tag_name': new FormControl(null, [Validators.required]),
      'tag_desc': new FormControl(null, [Validators.required]),
      'web_view_status': new FormControl(false)
    });
    if (this.userrole == 'admin') {
      let tag_id =
      {
        "tag_id": this.route.snapshot.paramMap.get('id')
      }

      this.tagservice.singleTagDetails(tag_id).subscribe(
        res => {
          this.tagname = res['data'].tag_name;
          this.tagdesc = res['data'].tag_description;
          this.tag_image = res['data'].tag_image;
          // Initialize toggle from API if available
          if (res['data'] && typeof res['data'].web_view_status !== 'undefined') {
            const isActive = (res['data'].web_view_status === 'active' || res['data'].web_view_status === true || res['data'].web_view_status === 1);
            this.tagSubmitForm.get('web_view_status')?.setValue(!!isActive);
          }
          if (this.tag_image) {
            const url = this.tag_image
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1];
            const fulltagname = lastPart.split('.');
            this.tagslug = fulltagname[fulltagname.length - 2];
            this.tag_image_name = res['data'].tag_image_name;
          }
          this.tag_slug = res['data'].tag_slug;
        },
        error => {
          this.toster.error(error.error.message)
        });
    }
  }


  // Create Room
  get tag_name() { return this.tagSubmitForm.get('tag_name') }
  get tag_desc() { return this.tagSubmitForm.get('tag_desc') }

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

  onTagEdit() {
    if (this.tagSubmitForm.invalid) {
      this.tagSubmitForm.markAllAsTouched();
      return;
    }

    let formData = this.tagSubmitForm.value;

    if (this.userrole == 'admin') {
      this.updatejson =
      {
        'tag_id': this.route.snapshot.paramMap.get('id'),
        "tag_name": formData.tag_name,
        "tag_image": this.tag_image,
        "tag_image_name": this.tag_image_name,
        "tag_description": formData.tag_desc,
        "web_view_status": formData.web_view_status ? 'active' : 'inactive'
      }
      console.log('this.updatejson', this.updatejson)
      this.tagservice.singleTagUpdate(this.updatejson).subscribe(
        res => {
          // console.log('Tag Updated',res);  
          this.taginsertMessage = "Tag Updated successfully";
          this.taginsertValid = true;
          /// settimeout Start
          const startTime = performance.now();
          this.ngZone.runOutsideAngular(() => {
            const checkTime = (currentTime: number) => {
              const elapsedTime = currentTime - startTime;
              if (elapsedTime >= 2000) {
                this.ngZone.run(() => {
                  this.router.navigate(['/tag/list-tag']);
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
      this.tag_image_name = file.name;
      const img = new Image();
      img.onload = () => {
        //   // total: 2256862
        // if(file.width == 400 && file.height == 400 && file.upload.total <= 5000000)
        // {
        this.tagservice.uploadImage(file).subscribe(
          (res) => {
            // console.log('Image Upload Sucess',res);
            this.tag_image = res['data'].fileUrl;
          },
          error => {
            this.toster.error(error.error.message)
          })

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
        this.onTagEdit();
      }
    }
  }

}
