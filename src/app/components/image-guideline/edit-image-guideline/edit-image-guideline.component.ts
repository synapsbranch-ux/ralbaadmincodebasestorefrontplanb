import { Component, NgZone, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ImageGuidlineService } from '../image-guideline.service';
import { ToastrService } from 'ngx-toastr';
import { TimingService } from 'src/app/timing.service';

@Component({
  selector: 'app-edit-image-guideline',
  templateUrl: './edit-image-guideline.component.html',
  styleUrls: ['./edit-image-guideline.component.scss']
})
export class EditImageGuidlineComponent implements OnInit {
  uploadStoreImages = [];

  imageinstinsertValid: boolean = false;
  imageinstinsertMessage: any

  image_instruction: any;
  page_image: any;
  image_size: any;
  image_width: any;
  image_height: any;

  userrole: any;
  isAdmin: boolean = false;

  updatejson: any;

  public imageistSubmitForm: FormGroup;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, public imageguidlineservice: ImageGuidlineService, private route: ActivatedRoute, private router: Router, private toastrService: ToastrService, private ngZone: NgZone) {

  }



  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }

    this.imageistSubmitForm = new FormGroup({
      'img_instruction': new FormControl(null, [Validators.required]),
      'img_size': new FormControl(null, [Validators.required]),
      'img_width': new FormControl(null, [Validators.required]),
      'img_height': new FormControl(null, [Validators.required]),

    });

    if (this.userrole == 'admin') {
      let imageinst_id =
      {
        "imageinst_id": this.route.snapshot.paramMap.get('id')
      }

      this.imageguidlineservice.singleImageinstDetailsAdmin(imageinst_id).subscribe(
        res => {
          this.image_instruction = res['data'].image_instruction;
          this.page_image = res['data'].page_image;
          this.image_size = res['data'].image_size;
          this.image_width = res['data'].image_width
          this.image_height = res['data'].image_height;
          // console.log('Single Image Inst Details =====',res['data'])

        },
        error => {
          this.toastrService.error(error.error.message)
        }
      );
    }




  }


  // Create Image
  get img_instruction() { return this.imageistSubmitForm.get('img_instruction').value; }
  get img_size() { return this.imageistSubmitForm.get('img_size').value; }
  get img_width() { return this.imageistSubmitForm.get('img_width').value; }
  get img_height() { return this.imageistSubmitForm.get('img_height').value; }


  onImageinstEdit() {
    let formData = this.imageistSubmitForm.value;

    let data = {
      "Imageinst_id": this.route.snapshot.paramMap.get('id'),
      'image_instruction': formData.img_instruction,
      'page_image': this.page_image,
      'image_size': formData.img_size,
      'image_width': formData.img_width,
      'image_height': formData.img_height
    }

    // console.log(data);
    this.imageguidlineservice.singleStoreUpdateAdmin(data).subscribe(
      res => {
        // console.log('Image Inst Update Success',res);       

        this.imageinstinsertValid = true;
        this.imageinstinsertMessage = "Image Guidline Updated successfully";

        /// settimeout Start
        const startTime = performance.now();
        this.ngZone.runOutsideAngular(() => {
          const checkTime = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= 2000) {
              this.ngZone.run(() => {
                this.router.navigate(['/images/list-imageguideline']);
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
        this.imageinstinsertValid = false;
        this.imageinstinsertMessage = error.error.message;
      }
    );

    // console.log('Image Inst Submitted');
  }



}
