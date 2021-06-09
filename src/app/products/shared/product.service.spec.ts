import { getTestBed, TestBed } from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { FileService } from 'src/app/files/shared/file.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';

describe('ProductService', () => {
    let angularFirestoreMock: any;
    let fileServiceMock: any;
    let httpMock: HttpTestingController;
    let service: ProductService;
    let fsCollectionMock: any;
    let helper: Helper;

  beforeEach(() => {
    helper = new Helper();
    angularFirestoreMock = jasmine.createSpyObj('AngularFirestore', ['collection']);
    fsCollectionMock = jasmine.createSpyObj('collection', ['snapshotChanges', 'valueChanges']);
    angularFirestoreMock.collection.and.returnValue(fsCollectionMock);
    fsCollectionMock.snapshotChanges.and.returnValue(of([])); 
    fileServiceMock = jasmine.createSpyObj('FileService', ['getFileUrl', 'upload']);
    
    TestBed.configureTestingModule({
        imports: [
            AngularFirestoreModule,
            HttpClientTestingModule,
        ],
        providers: [
            {provide: AngularFirestore, useValue: angularFirestoreMock},
            {provide: FileService, useValue: fileServiceMock}
        ]
    });

    httpMock = getTestBed().get(HttpTestingController);
    service = TestBed.get(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("getProducts", () => {

    beforeEach(() => {
        service.getProducts();
    }); 

    it('should call collection 1 time on AngularFirestore service', () => {
        expect(angularFirestoreMock.collection).toHaveBeenCalledTimes(1);
    });

    it('should call collection with "products" as param', () => {
        expect(angularFirestoreMock.collection).toHaveBeenCalledWith('products');
    });

      it('should call snapshotChanges 1 time on AngularFirestore service', () => {
        expect(fsCollectionMock.snapshotChanges).toHaveBeenCalledTimes(1);
      });
  });

  describe("getProducts Return Value", () => {
    it('should call getProducts return single product', () => {
        fsCollectionMock.snapshotChanges.and.returnValue(helper.getActions(1));
        service.getProducts().subscribe(products => {
            expect(products.length).toBe(1)
        })
    });
    

    it('should call getProducts return 10 products', () => {
        fsCollectionMock.snapshotChanges.and.returnValue(helper.getActions(10));
        service.getProducts().subscribe(products => {
            expect(products.length).toBe(10)
        })
    });
  });

  it('should call getProducts return single product with correct properties', () => {
    fsCollectionMock.snapshotChanges.and.returnValue(helper.getActions(1));
    service.getProducts().subscribe(products => {
        expect(products[0]).toEqual({
            id: 'abc0',
            name: 'abc0',
            pictureId: 'def0',
        })
    })
});

});



class Helper {
    actions = [];

    getActions(amount: number, addPictureId: boolean = true): Observable<any> {
        for(let i = 0; i < amount; i++) {
            /**
             *  const data = action.payload.doc.data() as Product;
                    return {
                        id: action.payload.doc.id,
                        name: data.name,
                        pictureId: data.pictureId
                    };
             */
            const product: Product = {
                id: 'abc',
                name: 'abc' + i
            }
            if(addPictureId){
                product.pictureId = 'def'+i;
            }
            this.actions.push({
                payload: {
                    doc: {
                        id: 'abc' + i,
                        data: () => product
                        }
                    }
                })
            }
            return of(this.actions);
        }

}