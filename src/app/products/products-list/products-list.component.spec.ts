import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Observable, of } from "rxjs";
import { FileService } from "src/app/files/shared/file.service";
import { Product } from "../shared/product.model";
import { ProductService } from "../shared/product.service";
import { ProductsListComponent } from "./products-list.component";

describe("ProductsListComponent", () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsListComponent],
      providers: [
        { provide: ProductService, useClass: ProductServiceStub },
        { provide: FileService, useClass: FileServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /** test by tag */
  it("should contain an h2 tag", () => {
    /** query takes first element of type h2 */
    const h2Element = fixture.debugElement.query(By.css("h2"));
    expect(h2Element.nativeElement.textContent).toBe("List all Products");
  });

  it("should minimum be one button on the page", () => {
    /** query takes all element of type button*/
    const buttons = fixture.debugElement.queryAll(By.css("button"));
    /** expression to be TRUE */
    expect(buttons.length >= 1).toBeTruthy();
  });

  it("Should be a + button first on the page", () => {
    const allbuttons = fixture.debugElement.queryAll(By.css("button"));
    const firstButton: HTMLButtonElement = allbuttons[0].nativeElement;
    expect(firstButton.textContent).toBe("+");
  });
});

class ProductServiceStub {
  getProducts(): Observable<Product[]> {
    return of([]);
  }
}

class FileServiceStub {}
