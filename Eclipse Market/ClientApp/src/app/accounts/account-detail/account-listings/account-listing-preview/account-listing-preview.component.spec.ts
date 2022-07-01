import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListingPreviewComponent } from './account-listing-preview.component';

describe('AccountListingPreviewComponent', () => {
  let component: AccountListingPreviewComponent;
  let fixture: ComponentFixture<AccountListingPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountListingPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListingPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
