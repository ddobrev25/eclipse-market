import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListingAddRequest } from "../models/listing.model";

@Injectable({
    providedIn: 'root'
})
export class ListingCreateCommunicationService {
    isAuction: boolean = true;

    listingCreateData: BehaviorSubject<ListingAddRequest | null>;

    constructor() {
        this.listingCreateData = new BehaviorSubject<ListingAddRequest | null>(null);
    }

    sendListingData(data: ListingAddRequest | null) {
        this.listingCreateData.next(data);
    }

}