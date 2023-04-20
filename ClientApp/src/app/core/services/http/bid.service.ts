import { HttpBackend, HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BidCreateRequest, BidGetAllResponse } from "../../models/bid.model";


@Injectable({
    providedIn: 'root'
})
export class BidService {
    private httpWithoutInterceptor: HttpClient;
    // private url = 'https://eclipsemarketapi.azurewebsites.net';
    private url = 'http://localhost:5001';
  
    constructor(private http: HttpClient, private httpBackend: HttpBackend) {
      this.httpWithoutInterceptor = new HttpClient(httpBackend);
    }

    getAllByAuction(body: number) {
        let queryParams = new HttpParams().set('auctionId', body);
        return this.http.get<BidGetAllResponse>(`${this.url}/Bid/GetAllByAuction`, {params: queryParams});
    }

    create(body: BidCreateRequest) {
        return this.http.post(`${this.url}/Bid/Create`, body);
    }
}