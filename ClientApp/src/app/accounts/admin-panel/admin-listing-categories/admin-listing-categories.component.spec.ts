import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListingCategoriesComponent } from './admin-listing-categories.component';

describe('AdminListingCategoriesComponent', () => {
  let component: AdminListingCategoriesComponent;
  let fixture: ComponentFixture<AdminListingCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminListingCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListingCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
