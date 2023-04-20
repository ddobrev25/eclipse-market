import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListingsComponent } from './user-listings.component';

describe('AccountListingsComponent', () => {
  let component: UserListingsComponent;
  let fixture: ComponentFixture<UserListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
