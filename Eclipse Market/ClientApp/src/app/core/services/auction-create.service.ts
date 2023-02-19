import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Auction$ } from "../models/auction.model";

@Injectable({
    providedIn: 'root'
})
export class AuctionCreateService {
    private auctionData$: BehaviorSubject<Auction$ | null>;

    constructor() {
        this.auctionData$ = new BehaviorSubject<Auction$ | null>(null);
    }
    
    get auctionData() {
        return this.auctionData$.asObservable();
    }

    setAuctionData(newData: Auction$ | null)
    {
        console.log(newData)
        this.auctionData$.next(newData);   
    }


}