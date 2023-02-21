import {
  HttpClient,
  HttpBackend,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  ListingAddRequest,
  ListingGetAllResponse,
  ListingGetByIdResponse,
  ListingGetByIdWithAuthorResponse,
  ListingGetRecommendedResponse,
  ListingUpdateImagesRequest,
  ListingUpdateRequest,
} from "../../models/listing.model";
import { DeleteRequest } from "../../models/user.model";

@Injectable({
  providedIn: "root",
})
export class ListingService {
  private httpWithoutInterceptor: HttpClient;
  // private url = 'https://eclipsemarketapi.azurewebsites.net';
  private url = "http://localhost:5001";

  constructor(
    private http: HttpClient,
    private httpBackend: HttpBackend,
    private router: Router
  ) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  getAll() {
    return this.http.get<ListingGetAllResponse>(`${this.url}/Listing/GetAll`);
  }
  getById(id: number) {
    const headers = new HttpHeaders({
      Accept: "application/json",
    });
    const queryParams = new HttpParams().set("id", id);
    return this.http.get<
      ListingGetByIdWithAuthorResponse | ListingGetByIdResponse
    >(`${this.url}/Listing/GetById`, { headers: headers, params: queryParams });
  }
  getRecommended(count: number) {
    const headers = new HttpHeaders({
      Accept: "application/json",
    });
    const queryParams = new HttpParams().set("count", count);
    return this.http.get<ListingGetRecommendedResponse>(
      `${this.url}/Listing/GetRecommended`,
      { headers: headers, params: queryParams }
    );
  }
  getRecommendedByCategory(count: number, categoryId: number) {
    const headers = new HttpHeaders({
      Accept: "application/json",
    });
    const queryParamsObj = {
      count: count,
      listingCategoryId: categoryId,
    };
    const queryParams = new HttpParams({ fromObject: queryParamsObj });

    return this.http.get<ListingGetRecommendedResponse>(
      `${this.url}/Listing/GetRecommended`,
      { headers: headers, params: queryParams }
    );
  }
  getCurrentListings() {
    return this.http.get<ListingGetAllResponse>(
      `${this.url}/Listing/GetCurrentByUserId`
    );
  }
  getBookmarkedListings() {
    return this.http.get<ListingGetAllResponse>(
      `${this.url}/Listing/GetBookmarkedByUserId`
    );
  }

  search(body: string) {
    let queryParams = new HttpParams().set("query", body);
    return this.http.get<ListingGetAllResponse>(`${this.url}/Listing/Search`, {
      params: queryParams,
    });
  }

  incrementViews(id: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      this.router.navigate(["auth"]);
      return;
    }

    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    const queryParams = new HttpParams().set("id", id);
    return this.http.put(`${this.url}/Listing/IncrementViews`, null, {
      params: queryParams,
      headers: headers,
    });
  }

  add(body: ListingAddRequest) {
    return this.http.post<number>(`${this.url}/Listing/Add`, body);
  }

  update(body: ListingUpdateRequest) {
    return this.http.put(`${this.url}/Listing/Update`, body);
  }

  updateImages(body: ListingUpdateImagesRequest) {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.post(`${this.url}/Listing/UpdateImages`, body, {
      headers: headers,
    });
  }

  delete(body: DeleteRequest) {
    return this.http.delete(`${this.url}/Listing/Delete`, { body: body });
  }
}
