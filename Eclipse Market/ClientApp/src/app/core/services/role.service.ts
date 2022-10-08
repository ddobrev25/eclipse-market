import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { IRoles } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private httpWithoutInterceptor: HttpClient;
  private url = "http://localhost:5001";

  constructor(private http: HttpClient,
              private httpBackend: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(httpBackend) }
  
  getAll() {
    var headers = new HttpHeaders({
      'Accept': 'application/json',
      'SkipLoader': ``
    });
    return this.http.get<IRoles>(`${this.url}/Role/GetAll`, {headers: headers})
  }
  add(body: any) {
    var headers = new HttpHeaders({
      'Accept': 'application/json',
      'SkipLoader': ``
    });
    return this.http.post(`${this.url}/Role/Add`, body, {headers: headers})
  }
  update(body: any) {
    var headers = new HttpHeaders({
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'SkipLoader': ``
    });
    return this.http.put(`${this.url}/Role/Update`, body, {headers: headers});
  }
  delete(body: any) {
    var headers = new HttpHeaders({
        'Content-type': 'application/json',
        'SkipLoader': ``
    });
    return this.http.delete(`${this.url}/Role/Delete`, {headers: headers, body: body})
  }

}

