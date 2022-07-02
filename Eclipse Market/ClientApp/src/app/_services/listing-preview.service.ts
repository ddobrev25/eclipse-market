import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ListingPreviewService {
    listingPreviewId = new BehaviorSubject<number>(0);

    constructor() {}

    sendListingId(data: number) {
        this.listingPreviewId.next(data);
    }
}