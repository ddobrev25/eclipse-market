import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Bid, Bid$, BidGetAllResponse } from "../../models/bid.model";

@Injectable({
  providedIn: "root",
})
export class AuctionDataService {
  private bid$: BehaviorSubject<Bid$ | null>;
  isAuctionExpired: boolean = false;

  constructor() {
    this.bid$ = new BehaviorSubject<Bid$ | null>(null);
  }

  get auctionExpired() {
    return this.isAuctionExpired;
  }

  get auctionBids() {
    return this.bid$.asObservable();
  }

  setBids(newData: BidGetAllResponse) {
    this.bid$.next(newData);
  }

  addBid(newBid: Bid) {
    if (!this.bid$.value) {
      const newData: Bid$ = [newBid];
      this.bid$.next(newData);
      return;
    }
    const newVal = this.bid$.value;
    newVal.unshift(newBid);

    this.bid$.next(newVal);
  }
}
