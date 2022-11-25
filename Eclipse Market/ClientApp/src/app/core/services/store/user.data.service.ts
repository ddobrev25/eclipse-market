import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User$, UserSetData$ } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private user$: BehaviorSubject<User$ | null>;
  constructor() {
    this.user$ = new BehaviorSubject<User$ | null>(null);
  }

  get userData(): Observable<User$> {
    return this.user$.asObservable();
  }

  setUserData(newData: UserSetData$) {
    this.user$.next({ ...this.user$.value!, ...newData! });
  }
}
