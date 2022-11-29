import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminDataCategories$, AdminDataRoles$, AdminDataUsers$ } from '../../models/admin.model';
import { UserGetAllResponse } from '../../models/user.model';

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
  setUsers(newData: AdminDataUsers$) {
    this.users$.next({ ...this.users$.value, ...newData! });
  }

  get roles(): Observable<AdminDataRoles$> {
    return this.roles$.asObservable();
  }
  setRoles(newData: AdminDataRoles$) {
    this.roles$.next({ ...this.roles$.value, ...newData! });
  }

  get categories(): Observable<AdminDataCategories$> {
    return this.listingCategories$.asObservable();
  }
  setCategories(newData: AdminDataCategories$) {
    this.listingCategories$.next({ ...this.listingCategories$.value, ...newData! });
  }
  
}

