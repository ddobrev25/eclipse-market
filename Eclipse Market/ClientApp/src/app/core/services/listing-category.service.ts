import { HttpClient, HttpBackend, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IListingCategories, IListingCategoryAddRequest, IListingCategoryDeleteRequest, IListingCategoryUpdateRequest } from "../models/listing-category.model";

@Injectable({
    providedIn: 'root'
})
export class ListingCategoryService {
    private httpWithoutInterceptor: HttpClient;
    private url = "http://localhost:5001";
    categories: any;

    constructor(private http: HttpClient,
                private httpBackend: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(httpBackend) }

    getAll() {
        return this.http.get<IListingCategories>(`${this.url}/ListingCategory/GetAll`);
    }
    add(body: IListingCategoryAddRequest) {
        var headers = new HttpHeaders({
            'SkipLoader': ``
        })
        return this.http.post(`${this.url}/ListingCategory/Add`, body, {headers: headers});
    }
    update(body: IListingCategoryUpdateRequest) {
        var headers = new HttpHeaders({
            'SkipLoader': ``
        })
        return this.http.put(`${this.url}/ListingCategory/Update`, body, {headers: headers});
    }
    delete(body: IListingCategoryDeleteRequest) {
        var headers = new HttpHeaders({
            'SkipLoader': ``
        })
        return this.http.delete(`${this.url}/ListingCategory/Delete`, {body: body, headers: headers});
    }

}   