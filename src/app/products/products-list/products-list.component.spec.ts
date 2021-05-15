import { Location } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
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
        /** when testing services dont pass real services
         *  instead pass stub (fake) service
         */
        { provide: ProductService, useClass: ProductServiceStub },
        { provide: FileService, useClass: FileServiceStub },
      ],
      imports: [
        /** check products-routing.module.ts
         * when testing routing dont pass a real component
         *  becaouse it requires some dependencies
         */
        RouterTestingModule.withRoutes([
          { path: "add", component: DummyComponent },
        ]),
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

  it("Should navigate to / before + button click", () => {
    const location = TestBed.get(Location);
    console.log({ location });
    expect(location.path()).toBe("");
  });

  it("Should navigate to /add after + button click", () => {
    const location = TestBed.get(Location);
    const buttons = fixture.debugElement.queryAll(By.css("button"));
    const nativeButton: HTMLButtonElement = buttons[0].nativeElement;
    /** when we click, we have to ask Angular to detect the changes (rerender)*/
    nativeButton.click();
    fixture.detectChanges();
    /** when changes are done, then we expect path to be '/add' */
    fixture.whenStable().then(() => {
      expect(location.path()).toBe("/add");
    });
  });

  it("Should show one unordered list item", () => {
    const unordereList = fixture.debugElement.queryAll(By.css("ul"));
    expect(unordereList.length).toBe(1);
  });

  it("Should show no list item when no products are available", () => {
    const listItem = fixture.debugElement.queryAll(By.css("li"));
    expect(listItem.length).toBe(0);
  });
});

class ProductServiceStub {
  getProducts(): Observable<Product[]> {
    return of([]);
  }
}

class FileServiceStub {}

class DummyComponent {}
