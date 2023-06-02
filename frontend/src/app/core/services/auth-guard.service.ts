import {Injectable} from '@angular/core';
import {catchError, Observable, of, switchMap} from "rxjs";
import {UsersApiService} from "../api";
import {Router} from "@angular/router";
import {AppRoutes} from "../../app-routes";
import {ApplicationStateService} from "./application-state.service";

@Injectable()
export class AuthGuardService {
  constructor(
    private readonly userApiService: UsersApiService,
    private readonly state: ApplicationStateService,
    private readonly router: Router
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.userApiService.checkToken().pipe(
      catchError(() => this.router.navigate([AppRoutes.Login])),
      switchMap(got => {
        if (typeof got !== 'boolean') {
          this.state.patchState({...got, userType: 'current'});
          return of(true);
        }
        return of(false);
      }));
  }
}
