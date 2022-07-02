import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCreatePricingComponent } from './listing-create-pricing.component';

describe('ListingCreatePricingComponent', () => {
  let component: ListingCreatePricingComponent;
  let fixture: ComponentFixture<ListingCreatePricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingCreatePricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingCreatePricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
