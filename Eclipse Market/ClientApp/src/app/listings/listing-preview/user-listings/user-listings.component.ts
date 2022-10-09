import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { IListing } from 'src/app/core/models/listing.model';
import { AuthorGetResponse } from 'src/app/core/models/user.model';
import { UserListingsService } from 'src/app/core/services/user-listings.service';


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
        console.log(resp);
      }
    )
  }
  onSelectListing(listingForPreview: IListing) {
    this.router.navigate(['/listings/preview'], {queryParams: {id: listingForPreview.id}})
  }
  ngOnDestroy() {
    this.fetchUserSubs?.unsubscribe();
  }
}
