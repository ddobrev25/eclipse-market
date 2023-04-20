import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthorGetResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserListingsService {
  private userListings$: BehaviorSubject<AuthorGetResponse | null>;
  constructor() {
    this.userListings$ = new BehaviorSubject<AuthorGetResponse | null>(null);
  }

  setUserListings(data: AuthorGetResponse) {
    this.userListings$.next(data);
  }

  get userListings(): Observable<AuthorGetResponse | null> {
    return this.userListings$.asObservable();
  }
}
