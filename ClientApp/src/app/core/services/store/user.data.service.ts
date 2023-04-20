import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";
import { User$ } from "../../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  get isLoggedIn() {
    const token = localStorage.getItem('token');
    if(!token) return false;
    return !this.jwtHelperService.isTokenExpired(token);
  }
  private user$: BehaviorSubject<User$ | null>;
  constructor(private jwtHelperService: JwtHelperService) {
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
