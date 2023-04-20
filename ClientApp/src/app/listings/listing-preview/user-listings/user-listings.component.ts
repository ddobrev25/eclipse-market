import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { ListingGetByIdResponse } from "src/app/core/models/listing.model";
import { AuthorGetResponse } from "src/app/core/models/user.model";
import { UserListingsService } from "src/app/core/services/user-listings.service";

@Component({
  selector: "app-user-listings",
  templateUrl: "./user-listings.component.html",
  styleUrls: ["./user-listings.component.scss"],
})
export class UserListingsComponent implements OnInit, OnDestroy {
  fetchUserSubs?: Subscription;
  userData$!: Observable<AuthorGetResponse>;
  userInfo!: AuthorGetResponse;

  constructor(
    private userListingsService: UserListingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserInfo();
  }
  fetchUserInfo() {
    this.fetchUserSubs = this.userListingsService.userListings.subscribe({
      next: (resp: AuthorGetResponse | null) => {
        if (!resp) {
          this.router.navigate(['/home']);
          return;
        }
        this.userInfo = resp;
      },
    });
  }
  onSelectListing(listingForPreview: ListingGetByIdResponse) {
    this.router.navigate(["/listings/preview"], {
      queryParams: { id: listingForPreview.id },
    });
  }
  ngOnDestroy() {
    this.fetchUserSubs?.unsubscribe();
  }
}
