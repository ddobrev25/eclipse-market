import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListingUpdateComponent } from './account-listing-update.component';

describe('AccountListingUpdateComponent', () => {
  let component: AccountListingUpdateComponent;
  let fixture: ComponentFixture<AccountListingUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountListingUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
