import {Component} from '@angular/core';
import {AdminRoutes} from "../../enums/admin-routes";
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.scss']
})
export class AdminRootComponent {
  readonly adminRoutes = AdminRoutes;

  constructor(private translocoService: TranslocoService) {
  }
  switchLanguage(language : string) {
    this.translocoService.setActiveLang(language);
  }
}
