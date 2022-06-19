import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { IRoles } from '../_models/role.model';

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

}

