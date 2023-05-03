import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {UsersApiService} from "../api";

@Injectable()
export class AuthGuardService {
  constructor(private readonly userApiService: UsersApiService) {
  }

  canActivate(): Observable<boolean> {
    return this.userApiService.checkToken();
  }
}
