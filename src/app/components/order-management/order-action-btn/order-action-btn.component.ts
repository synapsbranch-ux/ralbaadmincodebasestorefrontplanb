import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'user-order-action-btn',
  templateUrl: './order-action-btn.component.html',
  styleUrls: ['./order-action-btn.component.scss']
})
export class OrderActionBtnComponent implements  OnInit {
  renderValue: string;
  editBtnColor: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(  private router: Router, private toastr : ToastrService, private route: ActivatedRoute) {

  }
  ngOnInit() {
        
  }

  onClick() {
    this.router.navigate(['/users/user-order-list/'+this.rowData._id]);

  }

  vieworder()
{
  this.router.navigate(['order/view-order/'+this.rowData._id]);
}

orderStatusChange()
{
  this.router.navigate(['order/order-status-change/'+this.rowData._id]);
}
}