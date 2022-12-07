import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ListingAddRequest } from "../models/listing.model";
// import { IListingAddRequest } from "../models/listing.model";

@Injectable({
    providedIn: 'root'
})
export class ListingCreateCommunicationService {
    listingCreateData = new BehaviorSubject<ListingAddRequest>(
        {
            title: '',
            description: '',
            price: 0,
            location: '',
            listingCategoryId: 0,
            imageBase64String: []
        }
    );

    constructor() {}

    sendListingData(data: ListingAddRequest) {
        console.log(data)
        this.listingCreateData.next(data);
    }

}