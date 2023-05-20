import {Injectable} from '@angular/core';
import {Language} from "../models/language";
import {ApplicationStateService} from "./application-state.service";
import {TranslocoService} from "@ngneat/transloco";

@Injectable()
export class TranslationService {
  get currentLanguage(): string {
    return this._currentLanguage;
  }
  constructor(private readonly state: ApplicationStateService,
  private translocoService : TranslocoService) {
  }

  private _currentLanguage : string = this.translocoService.getActiveLang();

  changeLanguage() {
    switch (this.translocoService.getActiveLang()) {
      case Language.Hu: {
        this.translocoService.setActiveLang(Language.En);
        this.state.patchState({language: Language.En});
        break;
      }
      case Language.En: {
        this.translocoService.setActiveLang(Language.Hu);
        this.state.patchState({language: Language.Hu});
        break;
      }
  }
  }
}
