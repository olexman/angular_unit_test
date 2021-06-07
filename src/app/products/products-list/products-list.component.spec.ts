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
  let helper;
  let dh: DOMHelper;

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
    helper = new Helper();
    dh = new DOMHelper(fixture);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /** test by tag */
  it("should contain an h2 tag", () => {
    expect(dh.singleText('h2')).toBe("List all Products");
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

  it("Should show one list item when I have one product", () => {
    /** assign to observable some needed value, detechChanges, count elements */
    component.products = helper.getProducts(1);
    fixture.detectChanges();
    const listItems = fixture.debugElement.queryAll(By.css("li"));
    expect(listItems.length).toBe(1);
  });

  it("Should show 100 list item when I have 100 products", () => {
    component.products = helper.getProducts(100);
    fixture.detectChanges();
    const listItems = fixture.debugElement.queryAll(By.css("li"));
    expect(listItems.length).toBe(100);
  });

  it("Should show 100 delete button, 1 x item", () => {
    component.products = helper.getProducts(100);
    fixture.detectChanges();
    let listItems = fixture.debugElement.queryAll(By.css("button"));
    listItems = listItems.slice(1, listItems.length); //remove add button
    expect(listItems.length).toBe(100);
  });

  it("Should show 1 product name and id in span", () => {
    component.products = helper.getProducts(1);
    fixture.detectChanges();
    const spanItems = fixture.debugElement.queryAll(By.css("span"));
    expect(spanItems.length).toBe(1);
    const span = spanItems[0];
    const spanElement: HTMLSpanElement = span.nativeElement;
    expect(spanElement.textContent).toBe(
      helper.products[0].name + " -- " + helper.products[0].id
    );
  });
});

class ProductServiceStub {
  getProducts(): Observable<Product[]> {
    return of([]);
  }
}

class FileServiceStub {}

class DummyComponent {}

class Helper {
  products: Product[] = [];

  getProducts(amount: number): Observable<Product[]> {
    for (let i = 0; i < amount; i++) {
      this.products.push({
        id: "abc" + i,
        name: "item1" + i,
        pictureId: "def" + i,
      });
    }
    return of(this.products);
  }
}

class DOMHelper {
  private fixture: ComponentFixture<ProductsListComponent>;
  constructor(fixture: ComponentFixture<ProductsListComponent>){
    this.fixture = fixture;
  }

  /** get text */
  singleText(tagName: string): string {
      /** query takes first element of tagName */
     const h2Element = this.fixture.debugElement.query(By.css(tagName));
     if (h2Element) {
       return h2Element.nativeElement.textContent;
     }
  }
}