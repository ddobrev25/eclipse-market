import { HttpClient, HttpBackend, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IDelete } from "../models/delete.model";
import { IMessageEditRequest, IMessageGetAllByChatId, IMessageSendRequest } from "../models/message.model";

@Injectable({
    providedIn: 'root'
})
export class MsgService {
    private httpWithoutInterceptor: HttpClient;
    private url = "http://localhost:5001";
  
    constructor(private http: HttpClient,
                private httpBackend: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(httpBackend) }

    getAllByChatId(id: number) {
        let headers = new HttpHeaders({
            'SkipLoader': ``
        });
        let queryParams = new HttpParams().set('id', id);
        return this.http.get<IMessageGetAllByChatId>(`${this.url}/Message/GetAllByChatId`, {params: queryParams, headers: headers});
    }
    send(body: IMessageSendRequest) {
        let headers = new HttpHeaders({
            'SkipLoader': ``
        });
        return this.http.post(`${this.url}/Message/Send`, body, {headers: headers})
    }
    edit(body: IMessageEditRequest) {
        let headers = new HttpHeaders({
            'SkipLoader': ``
        });
        return this.http.put(`${this.url}/Message/Edit`, body, {headers: headers});
        console.log("metev");
    }
    delete(body: IDelete) {
        let headers = new HttpHeaders({
            'SkipLoader': ``
        });
        return this.http.delete(`${this.url}/Message/Delete`, {body: body, headers: headers})
    }
}