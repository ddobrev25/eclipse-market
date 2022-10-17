import { HttpClient, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IDelete } from "../models/delete.model";
import { IMessageEditRequest, IMessageSendRequest } from "../models/message.model";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private httpWithoutInterceptor: HttpClient;
    private url = "http://localhost:5001";
  
    constructor(private http: HttpClient,
                private httpBackend: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(httpBackend) }

    send(body: IMessageSendRequest) {
        return this.http.post(`${this.url}/Message/Send`, body)
    }
    edit(body: IMessageEditRequest) {
        return this.http.put(`${this.url}/Message/Edit`, body);
    }
    delete(body: IDelete) {
        return this.http.delete(`${this.url}/Message/Delete`, {body: body})
    }
}