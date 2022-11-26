import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListingGetByIdResponse } from "../models/listing.model";
// import { IListing } from "../models/listing.model";

@Injectable({
    providedIn: 'root'
})
export class ListingPreviewService {
    listingPreviewId = new BehaviorSubject<number>(0);
    selectedListing?: ListingGetByIdResponse;

    constructor() {}

    sendListingId(data: number) {
        this.listingPreviewId.next(data);
    }
    setSelectedListing(data: ListingGetByIdResponse) {
        this.selectedListing = data;
    }
}