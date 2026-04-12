import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'view-addons',
  templateUrl: './view-addons.component.html',
  styleUrls: ['./view-addons.component.scss']
})
export class ViewaddonsBtnComponent implements  OnInit {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {
  }

  onClick() {
    this.router.navigate(['/categories/list-addons/'+this.rowData._id]);

  }
}