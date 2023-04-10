import {Component} from '@angular/core';
import {AdminRoutes} from "../../enums/admin-routes";

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.scss']
})
export class AdminRootComponent {
  readonly adminRoutes = AdminRoutes;
}
