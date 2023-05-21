import {Component} from '@angular/core';
import {AdminRoutes} from "../../enums/admin-routes";
import {TranslationService} from "../../../../core/services/translation.service";

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.scss']
})
export class AdminRootComponent {
  readonly adminRoutes = AdminRoutes;

  constructor(    private readonly translationService : TranslationService) {
  }
  changeLanguage(): void {
    this.translationService.changeLanguage();
  }
}
