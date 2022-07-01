import { HttpClient, HttpBackend, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IListingCategories, IListingCategoryResponse } from "../_models/listing-category.model";

@Injectable({
    providedIn: 'root'
})
export class ListingCategoryService {
    private httpWithoutInterceptor: HttpClient;
    private url = "http://localhost:5001";

    constructor(private http: HttpClient,
                private httpBackend: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(httpBackend) }

    getAll() {
        var headers = new HttpHeaders({
            'SkipLoader': ``
        })
        return this.http.get<IListingCategories>(`${this.url}/ListingCategory/GetAll`, {headers: headers});
    }

}   