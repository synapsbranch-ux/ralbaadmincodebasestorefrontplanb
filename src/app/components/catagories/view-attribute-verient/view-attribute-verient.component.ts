import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'view-attribute-verient',
  templateUrl: './view-attribute-verient.component.html',
  styleUrls: ['./view-attribute-verient.component.scss']
})
export class ViewAttributeVerientBtnComponent implements OnInit {

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {
  }

  onClick() {
    this.router.navigate(['/categories/list-attribute-verient/'+this.rowData.attribute_id]);

  }
}