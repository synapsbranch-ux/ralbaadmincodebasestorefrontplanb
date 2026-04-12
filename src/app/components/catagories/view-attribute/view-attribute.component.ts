import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'view-attribute',
  templateUrl: './view-attribute.component.html',
  styleUrls: ['./view-attribute.component.scss']
})
export class ViewAttributeBtnComponent implements  OnInit {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {
  }

  onClick() {
    this.router.navigate(['/categories/list-attribute/'+this.rowData._id]);

  }
}