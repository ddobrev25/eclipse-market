import {
  HttpClient,
  HttpBackend,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ListingAddRequest,
  ListingGetAllResponse,
  ListingGetByIdResponse,
  ListingGetByIdWithAuthorResponse,
  ListingGetRecommendedResponse,
  ListingUpdateRequest,
} from '../../models/listing.model';
import { DeleteRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private httpWithoutInterceptor: HttpClient;
  private url = 'http://localhost:5001';

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
      Accept: 'application/json',
      SkipLoader: ``,
    });
    const queryParams = new HttpParams().set('id', id);
    return this.http.get<ListingGetByIdWithAuthorResponse | ListingGetByIdResponse>(
      `${this.url}/Listing/GetById`,
      { headers: headers, params: queryParams }
    );
  }
  getRecommended(count: number) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      SkipLoader: ``,
    });
    const queryParams = new HttpParams().set('count', count);
    return this.http.get<ListingGetRecommendedResponse>(
      `${this.url}/Listing/GetRecommended`,
      { headers: headers, params: queryParams }
    );
  }
  getRecommendedByCategory(count: number, categoryId: number) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      SkipLoader: ``,
    });
    const queryParams = new HttpParams()
    queryParams.append('count', count);
    queryParams.append('listingCategoryId', categoryId);

    return this.http.get<ListingGetRecommendedResponse>(
      `${this.url}/Listing/GetRecommended`,
      { headers: headers, params: queryParams }
    );
  }
  getCurrentListings() {
    const headers = new HttpHeaders({
      SkipLoader: ``
    });
    return this.http.get<ListingGetAllResponse>(`${this.url}/Listing/GetCurrentByUserId`, {headers: headers});
  }
  getBookmarkedListings() {
    const headers = new HttpHeaders({
      SkipLoader: ``
    });
    return this.http.get<ListingGetAllResponse>(`${this.url}/Listing/GetBookmarkedByUserId`, {headers: headers});
  }

  incrementViews(id: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['auth']);
      return;
    }

    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    const queryParams = new HttpParams().set('id', id);
    return this.http.put(`${this.url}/Listing/IncrementViews`, null, {
      params: queryParams,
      headers: headers,
    });
  }

  add(body: ListingAddRequest) {
    return this.http.post(`${this.url}/Listing/Add`, body);
  }

  update(body: ListingUpdateRequest) {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.put(`${this.url}/Listing/Update`, body, {headers: headers});
  }
  delete(body: DeleteRequest) {
    return this.http.delete(`${this.url}/Listing/Delete`, { body: body });
  }
}
