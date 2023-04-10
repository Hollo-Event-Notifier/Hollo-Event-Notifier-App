import {Injectable} from '@angular/core';
import {UserApiService} from "../api";
import {Observable} from "rxjs";

@Injectable()
export class AuthGuardService {
  constructor(private readonly userApiService: UserApiService) {
  }

  canActivate(): Observable<boolean> {
    return this.userApiService.checkToken();
  }
}
