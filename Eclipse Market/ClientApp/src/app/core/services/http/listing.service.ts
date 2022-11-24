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
    var headers = new HttpHeaders({
      Accept: 'application/json',
      SkipLoader: ``,
    });
    let queryParams = new HttpParams().set('id', id);
    return this.http.get<ListingGetByIdResponse>(
      `${this.url}/Listing/GetById`,
      { headers: headers, params: queryParams }
    );
  }
  getRecommended(count: number) {
    var headers = new HttpHeaders({
      Accept: 'application/json',
      SkipLoader: ``,
    });
    let queryParams = new HttpParams().set('count', count);
    return this.http.get<ListingGetRecommendedResponse>(
      `${this.url}/Listing/GetRecommended`,
      { headers: headers, params: queryParams }
    );
  }

  incrementViews(id: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['auth']);
      return;
    }

    var headers = new HttpHeaders({
      SkipLoader: ``,
    });
    let queryParams = new HttpParams().set('id', id);
    return this.http.put(`${this.url}/Listing/IncrementViews`, null, {
      params: queryParams,
      headers: headers,
    });
  }

  add(body: ListingAddRequest) {
    return this.http.post(`${this.url}/Listing/Add`, body);
  }

  update(body: ListingUpdateRequest) {
    return this.http.put(`${this.url}/Listing/Update`, body);
  }
  delete(body: DeleteRequest) {
    return this.http.delete(`${this.url}/Listing/Delete`, { body: body });
  }
}
