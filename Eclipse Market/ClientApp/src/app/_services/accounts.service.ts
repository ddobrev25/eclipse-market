import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AccountsService {
    isLoggedIn: boolean = false;

    constructor(private http: HttpClient) {

    }
    isAuthenticated(){
        return this.isLoggedIn;
    }

    url = "http://localhost:5001";

    public logIn(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(`${this.url}/User/Login`, body, {headers: headers, responseType: "json"});
    };
    
    public register(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(`${this.url}/User/Register`, body, {headers: headers, responseType: "json"});
    };
    
}