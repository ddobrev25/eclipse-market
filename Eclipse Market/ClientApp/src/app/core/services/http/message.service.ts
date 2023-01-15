import { HttpClient, HttpBackend, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Message, MessageEditRequest, MessageGetAllByChatIdResponse, MessageSendRequest } from '../../models/message.model';
import { DeleteRequest } from '../../models/user.model';

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
        return this.http.get<MessageGetAllByChatIdResponse>(`${this.url}/Message/GetAllByChatId`, {params: queryParams, headers: headers});
    }
    send(body: MessageSendRequest) {
        let headers = new HttpHeaders({
            'SkipLoader': ``
        });
        return this.http.post<Message>(`${this.url}/Message/Send`, body, {headers: headers})
    }
    edit(body: MessageEditRequest) {
        let headers = new HttpHeaders({
            'SkipLoader': ``
        });
        return this.http.put(`${this.url}/Message/Edit`, body, {headers: headers});
        console.log("metev");
    }
    delete(body: DeleteRequest) {
        let headers = new HttpHeaders({
            'SkipLoader': ``
        });
        let queryParams = new HttpParams().set('id', body.id);
        return this.http.delete(`${this.url}/Message/Delete`, {headers: headers, params: queryParams})
    }
}