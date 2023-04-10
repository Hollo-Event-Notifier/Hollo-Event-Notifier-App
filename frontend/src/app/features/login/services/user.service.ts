import {Injectable} from '@angular/core';
import {SnackbarService} from "../../../core/services/snackbar.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {UserApiService, UserCredentialsDto} from "../../../core/api";
import {AppRoutes} from "../../../app-routes";
import {take} from "rxjs";

@Injectable()
export class UserService {

  constructor(
    private userApi: UserApiService,
    private snackBar: SnackbarService,
    private router: Router
  ) {
  }

  loginUser(credentials: UserCredentialsDto): void {
    this.userApi.login(credentials)
      .pipe(take(1))
      .subscribe({
      next: () => this.router.navigate([AppRoutes.Admin]).then(),
      error: (err: HttpErrorResponse) => this.snackBar.open(err?.error)
    });
  }
}
