import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AccountsService {

    constructor(private http: HttpClient) {

    }

    url = "http://localhost:5001";

    public logIn(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(`${this.url}/User/Login`, body, {headers: headers, responseType: "json"});
    };
    
    public addUser(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(`${this.url}/User/Add`, body, {headers: headers, responseType: "json"});
    };
}