import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBookmarksComponent } from './account-bookmarks.component';

describe('AccountBookmarksComponent', () => {
  let component: AccountBookmarksComponent;
  let fixture: ComponentFixture<AccountBookmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountBookmarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBookmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
