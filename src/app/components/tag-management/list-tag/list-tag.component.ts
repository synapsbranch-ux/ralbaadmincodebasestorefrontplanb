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
import { TagService } from '../tag.service';


@Component({
  selector: 'app-list-tag',
  templateUrl: './list-tag.component.html',
  styleUrls: ['./list-tag.component.scss']
})
export class ListTagComponent implements OnInit {
  @ViewChild('tagDelete', { static: true })
  tagDelete!: TemplateRef<any>;
  smartTable: any;
  userrole: any;
  isAdmin: boolean = false;
  tagLists = [];
  tagavailable: boolean = false;
  delete_tag_id: any;
  delete_storeby_vendor: any;
  storeurl = environment.storeURL
  tag: any;
  tag_status_name: any;
  totalTags = 0;
  pageSize = 10;
  currentPage = 0;
  displayedColumns: string[] = ['tag_image', 'tag_name', 'status', 'web_view_status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private tagservice: TagService, private route: ActivatedRoute, private dialog: MatDialog, private toastrService: ToastrService) {

  }
  // public settings = {
  //   // hideSubHeader: true,
  //   columns: {
  //     tag_image:{
  //       title: 'Tag Image',
  //       type:'html',
  //       valuePrepareFunction: (value) =>
  //       { 
  //         if(value)
  //           {
  //             return '<img width="100px" class="product_image" src= ' + value + '  />' 
  //           }
  //           else
  //           {
  //             return '<img width="100px" class="product_image" src="assets/images/1.jpg" />'
  //           }

  //       },
  //     },
  //     tag_name: {
  //       title: 'Tag Name'
  //     },
  //     button: {
  //       title: 'Status',
  //       type: 'custom',
  //       renderComponent: TagStatusChangeComponent,
  //     },
  //   },     

  //   actions: {
  //     columnTitle: 'Actions',
  //     add: false,
  //     delete: true,
  //     position: 'right'
  //   },

  //   edit: {
  //     editButtonContent: '<i class="nb-edit"></i>',
  //     saveButtonContent: '<i class="nb-checkmark"></i>',
  //     cancelButtonContent: '<i class="nb-close"></i>',
  //   },
  //   mode: 'external',
  // };


  ngOnInit() {

    this.userrole = localStorage.getItem("user_role");
    if (this.userrole == 'admin') {
      this.isAdmin = true;
    }
    this.allTagList(this.currentPage, this.pageSize);

  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ngAfterViewInit(): void {

  //   this.smartTable.edit.subscribe( (dataObject: any) => {
  //     this.router.navigate(['/tag/edit-tag/'+dataObject["data"]._id]);
  //   });

  //   this.smartTable.delete.subscribe( (dataObject: any) => {
  //     this.delete_tag_id=dataObject["data"]._id;
  //     this.dialog.open(this.tagDelete,{ disableClose: false });
  //   });

  // }

  allTagList(page: number, pageSize: number) {

    /////  Admin All Tag   /////////

    if (this.userrole == 'admin') {
      this.tagservice.alltaglist(page + 1, pageSize).subscribe(
        res => {
          this.tagLists = res['data'].tagList;
          this.dataSource.data = res['data'].tagList;
          this.totalTags = res['data'].totalTags;  // Total number of data from API
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
      this.allTagList(this.currentPage, this.pageSize);
    }

  deleteConfirm() {

    ////////////////// Vendor Delete Tag    /////////////////
    if (this.userrole == 'admin') {
      this.tag =
      {
        "tag_id": this.delete_tag_id,
        "status": 'deleted'
      }

      this.tagservice.singleTagUpdate(this.tag).subscribe(
        res => {
          this.allTagList(this.currentPage, this.pageSize);
          this.toastrService.success('Your Tag Deleted Successfully');
        },
        error => {
          this.toastrService.error(error.error.message)
        }
      )
    }


  }

  statusChange(tag) {
    let vendor_id = localStorage.getItem('current-vendor')
    if (tag.status == 'active') {
      tag.status = "pending";
    }
    else {
      tag.status = "active";
    }
    let jsondata =
    {
      "tag_id": tag._id,
      "status": tag.status

    }
    this.tagservice.singleTagUpdate(jsondata).subscribe(
      res => {
        this.toastrService.success('Tag Updated', 'Success');
      },
      error => {
        this.toastrService.error(error.error.message)
      }
    );
  }

  // Toggle Website View Status (active/inactive)
  webViewStatusChange(tag: any, event: Event) {
    const input = event.target as HTMLInputElement;
    const newStatus = input.checked ? 'active' : 'inactive';
    // Optimistic UI update
    const previous = tag.web_view_status;
    tag.web_view_status = newStatus;

    const jsondata = {
      tag_id: tag._id,
      web_view_status: newStatus
    };

    this.tagservice.singleTagUpdate(jsondata).subscribe(
      res => {
        this.toastrService.success('Website view updated', 'Success');
      },
      error => {
        // Revert on error
        tag.web_view_status = previous;
        this.toastrService.error(error.error.message);
      }
    );
  }

  edit(tag) {
    this.router.navigate(['/tag/edit-tag/' + tag._id]);
  }
  delete(tag) {
    this.delete_tag_id = tag._id;
    this.dialog.open(this.tagDelete, { disableClose: false });
  }

}
