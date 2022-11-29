import {
  HttpClient,
  HttpBackend,
  HttpParams,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChatCreateRequest,
  ChatGetAllByUserIdResponse,
  ChatGetAllResponse,
  ChatGetByIdResponse,
} from '../../models/chat.model';
import { DeleteRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private httpWithoutInterceptor: HttpClient;
  private url = 'http://localhost:5001';

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  getAll() {
    return this.http.get<ChatGetAllResponse>(`${this.url}/Chat/GetAll`);
  }
  getAllByUserId() {
    let headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.get<ChatGetAllByUserIdResponse>(
      `${this.url}/Chat/GetAllByUserId`,
      { headers: headers }
    );
  }
  getById(id: number) {
    let queryParams = new HttpParams().set('id', id);
    return this.http.get<ChatGetByIdResponse>(`${this.url}/Chat/GetById`, {
      params: queryParams,
    });
  }
  create(body: ChatCreateRequest) {
    return this.http.post<number>(`${this.url}/Chat/Create`, body);
  }
  delete(chatId: DeleteRequest) {
    return this.http.delete(`${this.url}/Chat/Delete`);
  }
}
