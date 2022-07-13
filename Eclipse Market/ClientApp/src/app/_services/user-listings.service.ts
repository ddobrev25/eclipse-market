import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AuthorGetResponse } from "../_models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserListingsService {
    private data$: Subject<AuthorGetResponse> = new Subject<AuthorGetResponse>();

    next(data: AuthorGetResponse): void {
      this.data$.next(data);
    }
  
    select(): Observable<any> {
      return this.data$.asObservable();
    }
}