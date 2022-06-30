import { HttpClient, HttpBackend, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IListingAddRequest, IListingGetResponse } from "../_models/listing.model";

@Injectable({
    providedIn: 'root'
})
export class ListingService {
    private httpWithoutInterceptor: HttpClient;
    private url = "http://localhost:5001";

    constructor(private http: HttpClient,
                private httpBackend: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(httpBackend) }

    getAll() {
        return this.http.get<IListingGetResponse>(`${this.url}/Listing/GetAll`);
    }

    add(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
            'Content-type': 'application/json'
        });
        return this.http.post(`${this.url}/Listing/Add`, {body: body, headers: headers})
    }
}   