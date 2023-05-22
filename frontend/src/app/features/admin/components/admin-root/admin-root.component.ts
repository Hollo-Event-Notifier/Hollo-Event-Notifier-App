import {Component} from '@angular/core';
import {AdminRoutes} from "../../enums/admin-routes";
import {TranslationService} from "../../../../core/services/translation.service";

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.scss']
})
export class AdminRootComponent {
  currentLanguage : string;
  readonly adminRoutes = AdminRoutes;
  constructor(
    private readonly translationService : TranslationService) {
    this.currentLanguage = this.translationService.currentLanguage;
  }
  changeLanguage(): void {
    this.translationService.changeLanguage();
    this.currentLanguage = this.translationService.currentLanguage;
  }
}
