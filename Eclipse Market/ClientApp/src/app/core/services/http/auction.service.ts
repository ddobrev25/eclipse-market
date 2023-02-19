import { HttpBackend, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuctionCreateRequest, AuctionGetAllResponse } from "../../models/auction.model";

@Injectable({
    providedIn: 'root'
})
export class AuctionService {
    private httpWithoutInterceptor: HttpClient;
    // private url = 'https://eclipsemarketapi.azurewebsites.net';
    private url = 'http://localhost:5001';
  
  
    constructor(private http: HttpClient, private httpBackend: HttpBackend) {
      this.httpWithoutInterceptor = new HttpClient(httpBackend);
    }

    getAll() {
        return this.http.get<AuctionGetAllResponse>(`${this.url}/Auction/GetAll`);
    }

    create(body: AuctionCreateRequest) {
        return this.http.post(`${this.url}/Auction/Create`, body);
    }

    delete(id: number) {
        let queryParams = new HttpParams().set('id', id);
        return this.http.delete(`${this.url}/Auction/Delete`, {params: queryParams})
    }
}