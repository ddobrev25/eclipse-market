import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorGetResponse } from 'src/app/_models/user.model';
import { UserListingsService } from 'src/app/_services/user-listings.service';

@Component({
  selector: 'app-user-listings',
  templateUrl: './user-listings.component.html',
  styleUrls: ['./user-listings.component.scss']
})
export class UserListingsComponent implements OnInit, OnDestroy {
  fetchUserSubs?: Subscription;
  DataObs: any;

  constructor(private userListingsService: UserListingsService) { }

  ngOnInit(): void {
    this.fetchUserInfo();
  }
  fetchUserInfo() {
  this.DataObs = this.userListingsService.select();
   this.fetchUserSubs = this.DataObs.subscribe(
      (resp: AuthorGetResponse) => {
        console.log(resp);
      }
    )
  }
  ngOnDestroy() {
    this.fetchUserSubs?.unsubscribe();
  }
}
