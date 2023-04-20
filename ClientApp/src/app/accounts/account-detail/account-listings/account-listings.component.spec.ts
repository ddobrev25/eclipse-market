import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListingsComponent } from './account-listings.component';

describe('AccountListingsComponent', () => {
  let component: AccountListingsComponent;
  let fixture: ComponentFixture<AccountListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
