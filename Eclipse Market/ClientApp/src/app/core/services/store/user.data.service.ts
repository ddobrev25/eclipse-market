import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User$ } from "../../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  isLoggedIn: boolean = false;
  private user$: BehaviorSubject<User$ | null>;
  constructor() {
    this.user$ = new BehaviorSubject<User$ | null>(null);
  }

  get userData(): Observable<User$ | null> {
    return this.user$.asObservable();
  }

  setUserData(newData: User$ | null) {
    if (newData === null) {
      this.user$.next(null);
      return;
    }
    this.user$.next({ ...this.user$.value!, ...newData! });
  }
}
