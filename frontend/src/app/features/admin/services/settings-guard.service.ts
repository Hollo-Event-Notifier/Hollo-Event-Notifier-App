import {Injectable} from '@angular/core';
import {UserDtoRoleEnum} from "../../../core/api";
import {ApplicationStateService} from "../../../core/services/application-state.service";
import {User} from "../../../core/models/user";
import {Router} from "@angular/router";
import {SnackbarService} from "../../../core/services/snackbar.service";
import {AppRoutes} from "../../../app-routes";

@Injectable()
export class SettingsGuardService {
  private currentUser!: User;

  constructor(
    private readonly state: ApplicationStateService,
    private readonly router: Router,
    private readonly snackbar: SnackbarService
  ) {
    this.state.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  canActivate(): boolean {
    if(this.currentUser?.role !== UserDtoRoleEnum.SystemAdmin) {
      // TODO repair redirect
      this.router.navigate([AppRoutes.EventDisplay]).then();
      this.snackbar.open('You can\'t access this route!')
      return false;
    }
    return true;
  }
}
