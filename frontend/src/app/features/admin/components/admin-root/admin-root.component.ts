import {Component} from '@angular/core';
import {RouterOutletNames} from "../../../../core/enums/router-outlet-names";
import {AdminRoutes} from "../../enums/admin-routes";

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.scss']
})
export class AdminRootComponent {
  readonly routerOutletName = RouterOutletNames.Admin;
  readonly adminRoutes = AdminRoutes;

}
