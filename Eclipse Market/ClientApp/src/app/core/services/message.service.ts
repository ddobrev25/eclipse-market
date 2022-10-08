import { HttpClient, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IDelete } from "../models/delete.model";
import { IMessageRequest, IMessageResponse } from "../models/message.model";

@Injectable({
    providedIn: 'root'
})
export class MessangerService {
    private httpWithoutInterceptor: HttpClient;
    private url = "http://localhost:5001";
  
    constructor(private http: HttpClient,
                private httpBackend: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(httpBackend) }

    getAll() {
        return this.http.get<IMessageResponse>(`${this.url}/Message/GetAll`);
    }
    send(body: IMessageRequest) {
        return this.http.post(`${this.url}/Message/Send`, body)
    }
    delete(body: IDelete) {
        return this.http.delete(`${this.url}/Message/Delete`, {body: body})
    }
}