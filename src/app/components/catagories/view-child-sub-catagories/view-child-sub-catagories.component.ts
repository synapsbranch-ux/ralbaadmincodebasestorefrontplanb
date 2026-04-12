import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'view-child-sub-catagories',
  templateUrl: './view-child-sub-catagories.component.html',
  styleUrls: ['./view-child-sub-catagories.component.scss']
})
export class ViewChildSubCatagoriesBtnComponent implements  OnInit {
  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {
  }

  onClick() {
    this.router.navigateByUrl(`/categories/list-categories`, { skipLocationChange: true }).then(() => {
      this.router.navigate([`/categories/list-sub-categories/${this.rowData.category_id}`]);
  }); 
  }
}