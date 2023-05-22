import {Component} from '@angular/core';
import {AdminRoutes} from "../../enums/admin-routes";
import {AppRoutes} from "../../../../app-routes";
import {Observable} from "rxjs";
import {User} from "../../../../core/models/user";
import {ApplicationStateService} from "../../../../core/services/application-state.service";
import {UserDtoRoleEnum} from "../../../../core/api";

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.scss']
})
export class AdminRootComponent {
  readonly adminRoutes: typeof AdminRoutes = AdminRoutes;
  readonly appRoutes: typeof AppRoutes = AppRoutes
  readonly currentUser$: Observable<User>;
  readonly roles: typeof UserDtoRoleEnum = UserDtoRoleEnum;

  constructor(state: ApplicationStateService) {
    this.currentUser$ = state.currentUser$;
  }
}
