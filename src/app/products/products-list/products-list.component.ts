import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { FileService } from "../../files/shared/file.service";
import { Product } from "../shared/product.model";
import { ProductService } from "../shared/product.service";
@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.component.html",
  styleUrls: ["./products-list.component.scss"],
})
export class ProductsListComponent implements OnInit {
  products: Observable<Product[]>;
  constructor(private ps: ProductService, private fs: FileService) {}

  ngOnInit() {
    this.products = this.ps.getProducts().pipe(
      tap((products) => {
        products.forEach((product) => {
          if (product.pictureId) {
            this.fs.getFileUrl(product.pictureId).subscribe((url) => {
              product.url = url;
            });
          }
        });
      })
    );
  }

  deleteProduct(product: Product) {
    const obs = this.ps.deleteProduct(product.id);
    obs.subscribe(
      (productFromFirebase) => {
        debugger;
        window.alert(
          "product with id: " + productFromFirebase.id + " is Deleted"
        );
      },
      (error1) => {
        debugger;
        window.alert("product not found id: " + product.id);
      }
    );
  }
}
