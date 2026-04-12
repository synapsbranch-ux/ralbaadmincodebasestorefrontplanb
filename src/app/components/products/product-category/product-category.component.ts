import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  public closeResult: string;
  public categories_list = []

  constructor(private modalService: NgbModal, private productservice: ProductService, private router: Router, private toastrService:ToastrService) {

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  ngOnInit() {


    this.productservice.allCatagories().subscribe(
      res =>{
        this.categories_list=res['data'];
      },
      error => {
        this.toastrService.error(error.error.message)
    }
    )

  }

  edit_catagories(cat_id)
{
  this.router.navigate(['/products/edit-category/'+cat_id]);
  // console.log('Catagories Edit', cat_id);
}

delete_catagories(cat_id)
{
  // console.log('Catagories Deleted', cat_id);
}


}
