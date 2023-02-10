import {
  HttpClient,
  HttpBackend,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ListingCategoryAddRequest,
  ListingCategoryGetAllResponse,
  ListingCategoryGetByIdResponse,
  ListingCategoryUpdateRequest,
} from '../../models/listing-category.model';
import { DeleteRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ListingCategoryService {
  private httpWithoutInterceptor: HttpClient;
  // private url = 'https://eclipsemarketapi.azurewebsites.net';
  private url = 'http://localhost:5001';



  categories: any;

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  getAll() {
    var headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.get<ListingCategoryGetAllResponse>(
      `${this.url}/ListingCategory/GetAll`,
      {
        headers: headers,
      }
    );
  }
  getById(id: number) {
    let queryParams = new HttpParams().set('id', id);
    return this.http.get<ListingCategoryGetByIdResponse>(
      `${this.url}/ListingCategory/GetById`
    );
  }
  add(body: ListingCategoryAddRequest) {
    var headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.post(`${this.url}/ListingCategory/Add`, body, {
      headers: headers,
    });
  }
  update(body: ListingCategoryUpdateRequest) {
    var headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.put(`${this.url}/ListingCategory/Update`, body, {
      headers: headers,
    });
  }
  delete(body: DeleteRequest) {
    var headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.delete(`${this.url}/ListingCategory/Delete`, {
      body: body,
      headers: headers,
    });
  }
}
