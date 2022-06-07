import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { IUserGetAllResponse, IUserGetOneResponse } from "../_models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    
    constructor(private http: HttpClient) {}
    
    url = "http://localhost:5001";

    logIn(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(`${this.url}/User/Login`, body, {headers: headers, responseType: "json"});
    };
    
    register(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        return this.http.post(`${this.url}/User/Register`, body, {headers: headers, responseType: "json"});
    };
    
    getAll() {
        return this.http.get<IUserGetAllResponse[]>(`${this.url}/User/GetAll`);
    }

    getInfo(id: number) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        let queryParams = new HttpParams().set('id', id)
        return this.http.get<IUserGetOneResponse>(`${this.url}/User/GetById`, {headers: headers, params: queryParams});
    }
    
    update(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        return this.http.put(`${this.url}/User/Update`, body, {headers: headers, responseType: "json"});
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/User/Delete`)
    }
    
}