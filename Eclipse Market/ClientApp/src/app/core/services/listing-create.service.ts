import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IListingAddRequest } from "../models/listing.model";

@Injectable({
    providedIn: 'root'
})
export class ListingCreateCommunicationService {
    listingCreateData = new BehaviorSubject<IListingAddRequest>(
        {
            title: '',
            description: '',
            price: 0,
            location: '',
            listingCategory: '',
        }
    );

    constructor() {}

    sendListingData(data: IListingAddRequest) {
        this.listingCreateData.next(data);
    }

}