import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'view-addons-verient',
  templateUrl: './view-addons-verient.component.html',
  styleUrls: ['./view-addons-verient.component.scss']
})
export class ViewAddonsVerientBtnComponent implements  OnInit {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {
  }

  onClick() {
    this.router.navigate(['/categories/list-addons-verient/'+this.rowData.attribute_id]);

  }
}