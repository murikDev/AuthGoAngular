import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {catchError, retry, throwError} from "rxjs";
import {LocalStorage} from "../constants/constants";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    if (authService.isLoggedIn()) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authService.getUserTokenItem()}`
            },
        })
    }

  return next(req).pipe(
      retry(2),
      catchError((e: HttpErrorResponse) => {
            if (e.status == 401) {
                localStorage.removeItem(LocalStorage.token)
                router.navigate(['login'])
            }

            const error = e.error.message || e.statusText
            console.log(error)
            return throwError(() => error)
          }
      )
  );
};
