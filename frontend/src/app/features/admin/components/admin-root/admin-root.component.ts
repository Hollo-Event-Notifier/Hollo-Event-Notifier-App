import {Component} from '@angular/core';
import {AdminRoutes} from "../../enums/admin-routes";
import {AppRoutes} from "../../../../app-routes";

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.scss']
})
export class AdminRootComponent {
  readonly adminRoutes :typeof AdminRoutes = AdminRoutes;
  readonly appRoutes: typeof AppRoutes = AppRoutes
}
