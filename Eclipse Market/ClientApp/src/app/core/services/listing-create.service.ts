import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
// import { IListingAddRequest } from "../models/listing.model";

@Injectable({
    providedIn: 'root'
})
export class ListingCreateCommunicationService {
    // listingCreateData = new BehaviorSubject<IListingAddRequest>(
    //     {
    //         title: '',
    //         description: '',
    //         price: 0,
    //         location: '',
    //         listingCategoryId: 0,
    //         imageBase64String: ''
    //     }
    // );

    // constructor() {}

    // sendListingData(data: IListingAddRequest) {
    //     this.listingCreateData.next(data);
    // }

}