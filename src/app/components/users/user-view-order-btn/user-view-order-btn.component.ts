import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../user.service';



@Component({
  selector: 'user-view-order-btn',
  templateUrl: './user-view-order-btn.component.html',
  styleUrls: ['./user-view-order-btn.component.scss']
})
export class UserViewOrderBtnComponent implements OnInit {
  renderValue: string;
  editBtnColor: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor( private userservice: UsersService, private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {

  }

  onClick() {
    this.router.navigate(['/users/user-order-list/'+this.rowData._id]);

  }
}