import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MediaTextContentService } from '../media-text-content.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'list-media-text-content.component',
  templateUrl: './list-media-text-content.component.html',
  styleUrls: ['./list-media-text-content.component.scss']
})
export class ListMediaTextContentComponent implements OnInit {
  @ViewChild('mediaTextContentDelete', { static: true })
  mediaTextContentDelete!: TemplateRef<any>;
  smartTable: any;
  userrole: any;
  isAdmin: boolean = false;
  mediaTextContentLists = [];
  mediaTextContentavailable: boolean = false;
  delete_mediaTextContent_id: any;
  delete_storeby_vendor: any;
  storeurl = environment.storeURL
  mediaTextContent: any;
  mediaTextContent_status_name: any;
  totalMediaTexts = 0;
  pageSize = 10;
  currentPage = 0;
  displayedColumns: string[]
  // displayedColumns: string[] = ['section_image', 'heading_text', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  vendorType: any;

  currentUrl: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private mediaTextContentService: MediaTextContentService, private route: ActivatedRoute, private dialog: MatDialog, private toastrService: ToastrService) {

  }

  ngOnInit() {
    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.allMediaTextList(this.currentPage, this.pageSize);

    this.vendorType = localStorage.getItem('vendor_type');
    console.log("Vendor Type Of The User::::::::::::::", this.vendorType);

    if (this.vendorType === 'access') {
      this.displayedColumns = ['section_image', 'heading_text', 'web_view_status', 'status'];
    }
    else if (this.vendorType != 'access' && this.userrole != 'admin') {
      this.displayedColumns = ['section_image', 'heading_text', 'web_view_status', 'status', 'actions'];
    }
    else {
      this.displayedColumns = ['section_image', 'heading_text', 'status', 'actions'];
    }
    this.currentUrl = this.router.url;
    localStorage.setItem('lastUrl', this.currentUrl);



  }

  trackById(index: number, item: any) {
    return item.id;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  allMediaTextList(page: number, pageSize: number) {


    if (this.userrole == 'admin') {
      this.mediaTextContentService.allMediaTextContentlist(page + 1, pageSize).subscribe(
        res => {
          this.mediaTextContentLists = res['data'].mediaTextContentList;
          this.dataSource.data = res['data'].mediaTextContentList;
          this.totalMediaTexts = res['data'].totalMediaTextContentList;  // Total number of data from API
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }
    if (this.userrole == 'vendor') {
      this.mediaTextContentService.allVendorMediaTextContentlist(page + 1, pageSize).subscribe(
        res => {
          this.mediaTextContentLists = res['data'].vendorMediaList;
          this.dataSource.data = res['data'].vendorMediaList;
          this.totalMediaTexts = res['data'].totalMediaContent;  // Total number of data from API
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )

    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // Handle paginator page changes
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;          // Update page size when it changes
    this.currentPage = event.pageIndex;      // Get the current page index (0-based)
    // Fetch data for the new page and page size
    this.allMediaTextList(this.currentPage, this.pageSize);
  }

  deleteConfirm() {

    if (this.userrole == 'admin') {
      this.mediaTextContent =
      {
        "media_text_contain_id": this.delete_mediaTextContent_id,
        "status": 'deleted'
      }

      this.mediaTextContentService.singleMediaTextContentUpdate(this.mediaTextContent).subscribe(
        res => {
          this.allMediaTextList(this.currentPage, this.pageSize);
          this.toastrService.success('Your Media Text Contain Deleted Successfully');
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }


  }

  statusChange(mediaTextContent) {
    let vendor_id = localStorage.getItem('current-vendor')
    if (mediaTextContent.status == 'active') {
      mediaTextContent.status = "pending";
    }
    else {
      mediaTextContent.status = "active";
    }
    let jsondata =
    {
      "media_text_contain_id": mediaTextContent.media_text_contain_id ? mediaTextContent.media_text_contain_id : mediaTextContent._id,
      "status": mediaTextContent.status

    }
    this.mediaTextContentService.singleMediaTextContentUpdate(jsondata).subscribe(
      res => {
        this.toastrService.success('Media Conatin Text Updated', 'Success');
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }

  webstatusChange(mediaTextContent) {
    if(this.vendorType === 'access'){
      // this.toastrService.error('You are not authorized', 'Error');
      return;
    }
    console.log('mediaTextContent', mediaTextContent);
    if (mediaTextContent.web_view_status == 'active') {
      mediaTextContent.web_view_status = "inactive";
    }
    else {
      mediaTextContent.web_view_status = "active";
    }
    let jsondata =
    {
      "media_text_contain_id": mediaTextContent.media_text_contain_id ? mediaTextContent.media_text_contain_id : mediaTextContent._id,
      "web_view_status": mediaTextContent.web_view_status

    }
    this.mediaTextContentService.singleVendorMediaTextContentUpdate(jsondata).subscribe(
      res => {
        if(res.error===0){
          this.toastrService.success('Media Conatin Text Updated', 'Success');
        }else{
          this.toastrService.error('You are not authorized', 'Error');
        }
        
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }

  edit(mediaTextContent) {
    this.router.navigate([`/media-text-content/edit-media-text-content/${mediaTextContent.media_text_contain_id ? mediaTextContent.media_text_contain_id : mediaTextContent._id}`]);
  }
  delete(mediaTextContent) {
    this.delete_mediaTextContent_id = mediaTextContent.media_text_contain_id ? mediaTextContent.media_text_contain_id : mediaTextContent._id;
    this.dialog.open(this.mediaTextContentDelete, { disableClose: false });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (this.vendorType != 'access') {
      moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
      this.dataSource._updateChangeSubscription(); // Notify the table about the data change

      // Update positions in the local array
      this.dataSource.data.forEach((item, index) => {
        item.position = index + 1;  // Reassign new positions, starting from 1
      });

      // IMPORTANT: refresh table
  this.dataSource.data = [...this.dataSource.data];

      // Optionally, send the updated order to the backend
      this.saveNewOrder(this.dataSource.data);
    }

  }

  saveNewOrder(updatedItems: any[]) {
    if (this.isAdmin) {
      this.mediaTextContentService.updateMediaTextPostion(updatedItems).subscribe(
        res => {
          console.log('Postion Updated')
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }
    else {
      this.mediaTextContentService.updateVendorMediaTextPostion(updatedItems).subscribe(
        res => {
          console.log('Postion Updated')
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }

  }

}
