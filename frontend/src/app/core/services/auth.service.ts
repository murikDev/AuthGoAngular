import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiResponse, LoginPayLoad, RegisterPayLoad, User} from "../model/common.model";
import {ApiEndpoints, LocalStorage} from "../constants/constants";
import {map} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    isLoggedIn = signal<boolean>(false)
    router = inject(Router)

    constructor(private _http: HttpClient) {
        if (this.getUserToken()) {
            this.isLoggedIn.update(() => true)
        }
    }

    register(payload: RegisterPayLoad) {
        return this._http
            .post<ApiResponse<User>>(`${ApiEndpoints.Auth.Register}`,payload);
    }

    login(payload: LoginPayLoad) {
        return this._http
            .post<ApiResponse<User>>(`${ApiEndpoints.Auth.Login}`,payload)
            .pipe(
                map((response) => {
                    if (response.status && response.token) {
                        localStorage.setItem(LocalStorage.token, response.token)
                        this.isLoggedIn.update(() => true)
                    }
                    return response
                })
            )
    }

    user() {
        return this._http.get<ApiResponse<User>>(`${ApiEndpoints.Auth.Profile}`);
    }

    getUserToken() {
        return !!localStorage.getItem(LocalStorage.token)
    }

    getUserTokenItem() {
        return localStorage.getItem(LocalStorage.token)
    }

    logout() {
        localStorage.removeItem(LocalStorage.token)
        this.isLoggedIn.update(() => false)
        this.router.navigate(['login'])
    }

}
