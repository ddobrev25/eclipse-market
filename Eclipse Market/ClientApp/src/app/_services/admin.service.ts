import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUsers } from "../_models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    url = "http://localhost:5001";

    constructor(private http: HttpClient) {}

    getAllUsers() {
        return this.http.get<IUsers>(`${this.url}/Admin/GetAllUsers`);
    }

    getById(id: number) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        let queryParams = new HttpParams().set('id', id);
        return this.http.get(`${this.url}/Admin/GetInfo`, {headers: headers, params: queryParams});
    }

    updateById(id: number, body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        let queryParams = new HttpParams().set('id', id);
        return this.http.put(`${this.url}/User/Update`, body, {headers: headers, params: queryParams});
    }
    
}