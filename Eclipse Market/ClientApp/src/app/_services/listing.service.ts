import { HttpClient, HttpBackend, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IListingGetResponse } from "../_models/listing.model";

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
    getById(id: number) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
            'SkipLoader': ``
        });
        let queryParams = new HttpParams().set('id', id)
        return this.http.get<IListingGetResponse>(`${this.url}/Listing/GetById`, {headers: headers, params: queryParams});
    }

    add(body: any) {
        var headers = new HttpHeaders({
        });
        return this.http.post(`${this.url}/Listing/Add`, body, { headers: headers})
    }
}   