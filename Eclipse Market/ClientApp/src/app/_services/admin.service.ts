import { Injectable} from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { IUsers } from '../_models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  accounts?: IUsers;
  accSubs: Subscription | undefined;
  
  private accountsSubject = new ReplaySubject<IUsers>(1);
  accountsObs: Observable<IUsers> = this.accountsSubject.asObservable(); 
  
  constructor(private userService: UserService) {}

  getAccounts() {
    if(!this.accounts){
      this.accSubs = this.userService.getAll().subscribe(
        resp => {
          this.accountsSubject.next(resp);
        }
      )
    } 
  }

  ngOnDestroy() {
      this.accSubs?.unsubscribe();
  }
}
