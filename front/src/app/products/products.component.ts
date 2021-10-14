import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../product';
import { ProductService } from '../product.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {

  prodName: string = '';

  products:Product[] = [];

  prodEdit:Product = null;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(private productService: ProductService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.productService.get()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((prods)=> this.products = prods)
  }

  save() {
    if (this.prodEdit) {
      this.productService.update(
        { name: this.prodName, _id: this.prodEdit._id }
      ).subscribe(
        (prod) => {
          this.notify('UPDATED')
        },
        (err) => {
          this.notify('ERROR');
          console.error(err)
        }
      )
    }
    else {
      if (this.prodName.length == 0) {
        this.cancel();
      }
      else {
        this.productService.add({ name: this.prodName })
          .subscribe(
            (prod) => {
              console.log(prod);
              this.notify('INSERTED!');
            },
            (err) => {
              console.error(err);
            }
          )
      }
    }
    this.clearFields();
  }

  edit(prod:Product){
    this.prodName = prod.name;
    this.prodEdit =prod;
  }

  delete(prod:Product){
    this.productService.del(prod)
    .subscribe(
      ()=> this.notify('REMOVED!'),
      (err)=> this.notify(err.error.msg)
      )
  }

  clearFields(){
    this.prodName = '';
    this.prodEdit = null;
  }

  cancel(){
    this.clearFields();
  }

  notify(msg: string){
    this.snackbar.open(msg, "OK", {duration: 3000})
  }

  ngOnDestroy(){
    this.unsubscribe$.next()
  }

}
