import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'view-sub-catagories',
  templateUrl: './view-sub-catagories.component.html',
  styleUrls: ['./view-sub-catagories.component.scss']
})
export class ViewSubCatagoriesBtnComponent implements  OnInit {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {
  }

  onClick() {
    localStorage.setItem('cat_id',this.rowData._id)
    this.router.navigate(['/categories/list-sub-categories/'+this.rowData._id]);

  }
}