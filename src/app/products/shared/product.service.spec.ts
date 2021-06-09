import { getTestBed, TestBed } from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { FileService } from 'src/app/files/shared/file.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { of } from 'rxjs';

describe('ProductService', () => {
    let angularFirestoreMock: any;
    let fileServiceMock: any;
    let httpMock: HttpTestingController;
    let service: ProductService;
    let fsCollection: any;

  beforeEach(() => {
    angularFirestoreMock = jasmine.createSpyObj('AngularFirestore', ['collection']);
    fsCollection = jasmine.createSpyObj('collection', ['snapshotChanges']);
    angularFirestoreMock.collection.and.returnValue(fsCollection);
    fsCollection.snapShotCollection.and.returnValue(of([])); 
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

  describe("get products", () => {
    it('should call collection and snapshotChange on AngularFirestore', () => {
        service.getProducts();
        expect(angularFirestoreMock.collection).toHaveBeenCalledTimes(1);
      });
  })

});
