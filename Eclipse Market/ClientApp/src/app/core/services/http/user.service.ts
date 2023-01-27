import { Injectable } from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {
  BookmarkListingRequest,
  DeleteRequest,
  UnBookmarkListingRequest,
  UserChangePassword,
  UserGetAllResponse,
  UserGetInfoResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserRegisterRequest,
  UserUpdateImageRequest,
  UserUpdateRequest,
} from '../../models/user.model';
import { Observable } from 'rxjs';
import { PenTestService } from 'src/app/pen-test-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpWithoutInterceptor: HttpClient;
  private url = this.penTest.url;


  constructor(private http: HttpClient, private httpBackend: HttpBackend, private penTest: PenTestService) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  logIn(body: UserLoginRequest): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.post<UserLoginResponse>(`${this.url}/User/Login`, body, {
      headers: headers,
      responseType: 'json',
    });
  }

  register(body: UserRegisterRequest) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.post(`${this.url}/User/Register`, body, {
      headers: headers,
      responseType: 'json',
    });
  }

  getAll() {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.get<UserGetAllResponse>(`${this.url}/User/GetAll`, {
      headers: headers,
    });
  }
  getInfo(id?: number) {
    if (id) {
      const queryParams = new HttpParams().set('id', id);
      return this.http.get<UserGetInfoResponse>(`${this.url}/User/GetById`, {
        params: queryParams,
      });
    }
    return this.http.get<UserGetInfoResponse>(`${this.url}/User/GetById`);
  }

  update(body: UserUpdateRequest) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.put(`${this.url}/User/Update`, body, {
      headers: headers,
      responseType: 'json',
    });
  }

  changePassword(body: UserChangePassword) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.put(`${this.url}/User/ChangePassword`, body, {
      headers: headers,
    });
  }

  updateImage(body: UserUpdateImageRequest) {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.put(`${this.url}/User/UpdateImage`, body, {
      headers: headers,
    });
  }

  bookmarkListing(body: BookmarkListingRequest) {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.post(`${this.url}/User/BookmarkListing`, body, {
      headers: headers
    });
  }
  unBookmarkListing(body: UnBookmarkListingRequest) {
    const headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.delete(`${this.url}/User/UnbookmarkListing`, {
      headers: headers,
      body: body
    });
  }

  delete(body: DeleteRequest) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      SkipLoader: ``,
    });
    return this.http.delete(`${this.url}/User/Delete`, {
      headers: headers,
      body: body,
    });
  }
}
