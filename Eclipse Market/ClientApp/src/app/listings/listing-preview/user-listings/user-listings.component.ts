import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IListing } from 'src/app/_models/listing.model';
import { AuthorGetResponse } from 'src/app/_models/user.model';
import { UserListingsService } from 'src/app/_services/user-listings.service';

@Component({
  selector: 'app-user-listings',
  templateUrl: './user-listings.component.html',
  styleUrls: ['./user-listings.component.scss']
})
export class UserListingsComponent implements OnInit, OnDestroy {
  fetchUserSubs?: Subscription;
  userData$!: Observable<AuthorGetResponse>;
  userInfo!: AuthorGetResponse;

  constructor(private userListingsService: UserListingsService,
              private router: Router) { }

  ngOnInit(): void {
    this.fetchUserInfo();
  }
  fetchUserInfo() {
  this.userData$ = this.userListingsService.select();
   this.fetchUserSubs = this.userData$.subscribe(
      (resp: AuthorGetResponse) => {
        this.userInfo = resp;
      }
    )
  }
  onSelectListing(listingForPreview: IListing) {
    this.router.navigate(['/listings/preview'], {queryParams: {id: this.userInfo.listings}})
  }
  ngOnDestroy() {
    this.fetchUserSubs?.unsubscribe();
  }
}
