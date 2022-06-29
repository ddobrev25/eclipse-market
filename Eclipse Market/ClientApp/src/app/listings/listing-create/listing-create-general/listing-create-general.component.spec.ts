import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCreateGeneralComponent } from './listing-create-general.component';

describe('ListingCreateGeneralComponent', () => {
  let component: ListingCreateGeneralComponent;
  let fixture: ComponentFixture<ListingCreateGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingCreateGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingCreateGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
