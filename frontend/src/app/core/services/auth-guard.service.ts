import {Injectable} from '@angular/core';
import {catchError, Observable} from "rxjs";
import {UsersApiService} from "../api";
import {Router} from "@angular/router";
import {AppRoutes} from "../../app-routes";

@Injectable()
export class AuthGuardService {
  constructor(
    private readonly userApiService: UsersApiService,
    private readonly router: Router
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.userApiService.checkToken().pipe(
      catchError(() => this.router.navigate([AppRoutes.Login]))
    );
  }
}
