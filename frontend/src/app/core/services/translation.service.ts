import {Injectable} from '@angular/core';
import {Language} from "../models/language";
import {ApplicationStateService} from "./application-state.service";
import {TranslocoService} from "@ngneat/transloco";

@Injectable()
export class TranslationService {
  get currentLanguage(): Language {
    if (this.translocoService.getActiveLang() == Language.Hu) return Language.Hu
    return Language.En;
  }

  constructor(
    private readonly state: ApplicationStateService,
    private readonly translocoService: TranslocoService) {
  }

  changeLanguage() {
    switch (this.translocoService.getActiveLang()) {
      case Language.Hu: {
        this.translocoService.setActiveLang(Language.En);
        this.state.patchState({language: Language.En});
        break;
      }
      default: {
        this.translocoService.setActiveLang(Language.Hu);
        this.state.patchState({language: Language.Hu});
        break;
      }
    }
  }
}
