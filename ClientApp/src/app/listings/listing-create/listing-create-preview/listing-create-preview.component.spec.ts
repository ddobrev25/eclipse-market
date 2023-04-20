import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCreatePreviewComponent } from './listing-create-preview.component';

describe('ListingCreatePreviewComponent', () => {
  let component: ListingCreatePreviewComponent;
  let fixture: ComponentFixture<ListingCreatePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingCreatePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingCreatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
