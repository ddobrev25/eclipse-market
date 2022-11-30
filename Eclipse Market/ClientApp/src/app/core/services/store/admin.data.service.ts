import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AdminDataCategories$,
  AdminDataRoles$,
  AdminDataUsers$,
} from '../../models/admin.model';
import { ListingCategoryGetAllResponse, ListingCategoryGetByIdResponse } from '../../models/listing-category.model';
import { RoleGetByIdResponse } from '../../models/role.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminDataService {
  private users$: BehaviorSubject<AdminDataUsers$>;
  private roles$: BehaviorSubject<AdminDataRoles$>;
  private listingCategories$: BehaviorSubject<AdminDataCategories$>;

  constructor() {
    this.users$ = new BehaviorSubject<AdminDataUsers$>(null);
    this.roles$ = new BehaviorSubject<AdminDataRoles$>(null);
    this.listingCategories$ = new BehaviorSubject<AdminDataCategories$>(null);
  }

  get users(): Observable<AdminDataUsers$> {
    return this.users$.asObservable();
  }
  addToUsers(newData: AdminDataUsers$) {
    this.users$.next({ ...newData!, ...this.users$.value });
  }
  removeUser(userForDelete: User) {
    this.users$.next(Object.values(this.users$.value!).filter(x => x.id !== userForDelete.id));
  }

  get roles(): Observable<AdminDataRoles$> {
    return this.roles$.asObservable();
  }
  addToRoles(newData: AdminDataRoles$) {
    this.roles$.next({ ...newData!, ...this.roles$.value });
  }
  removeRole(roleForDelete: RoleGetByIdResponse) {
    this.roles$.next(Object.values(this.roles$.value!).filter(x => x.id !== roleForDelete.id));
  }

  get categories(): Observable<AdminDataCategories$> {
    return this.listingCategories$.asObservable();
  }
  addToCategories(newData: AdminDataCategories$) {
    this.listingCategories$.next({
      ...newData!,
      ...this.listingCategories$.value,
    });
  }
  removeCategory(categoryForDelete: ListingCategoryGetByIdResponse) {
    this.listingCategories$.next(Object.values(this.listingCategories$.value!).filter(x => x.id !== categoryForDelete.id));
  }
}
