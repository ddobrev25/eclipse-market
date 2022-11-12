import {
  HttpClient,
  HttpBackend,
  HttpParams,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IChatCreateRequest,
  IChatGetAllByUserIdResponse,
  IChatGetAllResponse,
  IChatGetByIdResponse,
} from '../models/chat.model';
import { IDelete } from '../models/delete.model';

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
    return this.http.get<IChatGetAllResponse>(`${this.url}/Chat/GetAll`);
  }
  getAllByUserId() {
    let headers = new HttpHeaders({
      SkipLoader: ``,
    });
    return this.http.get<IChatGetAllByUserIdResponse>(
      `${this.url}/Chat/GetAllByUserId`,
      { headers: headers }
    );
  }
  getById(id: number) {
    let queryParams = new HttpParams().set('id', id);
    return this.http.get<IChatGetByIdResponse>(`${this.url}/Chat/GetById`, {
      params: queryParams,
    });
  }
  create(body: IChatCreateRequest) {
    return this.http.post(`${this.url}/Chat/Create`, body);
  }
  delete(chatId: IDelete) {
    return this.http.delete(`${this.url}/Chat/Delete`);
  }
}
