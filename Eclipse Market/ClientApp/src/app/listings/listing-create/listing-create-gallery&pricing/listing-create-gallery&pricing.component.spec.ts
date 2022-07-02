import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCreateGalleryComponent } from './listing-create-gallery&pricing.component';

describe('ListingCreateGalleryComponent', () => {
  let component: ListingCreateGalleryComponent;
  let fixture: ComponentFixture<ListingCreateGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingCreateGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingCreateGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
