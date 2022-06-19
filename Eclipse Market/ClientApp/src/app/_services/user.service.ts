import { Injectable } from "@angular/core";
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { IUser, IUsers } from "../_models/user.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private httpWithoutInterceptor: HttpClient;
    private url = "http://localhost:5001";
    
    constructor(private http: HttpClient,
                private httpBackend: HttpBackend) { this.httpWithoutInterceptor = new HttpClient(httpBackend) }
    
    logIn(body: any): Observable<any> {
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
        var headers = new HttpHeaders({
            'SkipLoader': ``
        });
        return this.http.get<IUsers>(`${this.url}/User/GetAll`, {headers: headers});
    }

    getInfo() { 
        var headers = new HttpHeaders({
            'Accept': 'application/json',
            'SkipLoader': ``
        });
        return this.http.get<IUser>(`${this.url}/User/GetById`, {headers: headers});
    }

    getById(id: number) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
            'SkipLoader': ``
        });
        let queryParams = new HttpParams().set('id', id)
        return this.http.get(`${this.url}/User/GetById`, {headers: headers, params: queryParams});
    }
    
    update(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        return this.http.put(`${this.url}/User/Update`, body, {headers: headers, responseType: "json"});
    }

    changePassword(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        return this.http.put(`${this.url}/User/ChangePassword`, body, {headers: headers})
    }

    delete(body: any) {
        var headers = new HttpHeaders({
            'Content-type': 'application/json',
            'SkipLoader': ``
        });
        return this.http.delete(`${this.url}/User/Delete`, {headers: headers, body: body})
    }
    
}