import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { AuthorGetResponse } from "../_models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserListingsService {
    private data$: BehaviorSubject<AuthorGetResponse> = new BehaviorSubject<AuthorGetResponse>({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateCreated: ''
    });

    next(data: AuthorGetResponse): void {
      this.data$.next(data);
    }
  
    select(): Observable<any> {
      return this.data$.asObservable();
    }
}