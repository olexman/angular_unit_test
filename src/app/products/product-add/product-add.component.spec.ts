import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProductService } from '../shared/product.service';
import { ProductAddComponent } from './product-add.component';


describe('ProductAddComponent', () => {
  let component: ProductAddComponent;
  let fixture: ComponentFixture<ProductAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAddComponent ],
      imports: [
        ImageCropperModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        {provide: ProductService, useClass: ProductServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


class ProductServiceStub {

}