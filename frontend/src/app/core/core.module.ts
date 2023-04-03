import {NgModule, Optional, Provider, SkipSelf} from '@angular/core';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ApplicationStateService} from "./services/application-state.service";
import {SnackbarService} from "./services/snackbar.service";

const IMPORTS = [
  MatSnackBarModule
];

// TODO: Delete never type
const EXPORTS: never[] = [];

const PROVIDERS: Provider[] = [
  ApplicationStateService,
  SnackbarService
];

const API_SERVICES: Provider[] = [];

@NgModule({
  imports: [...IMPORTS],
  exports: [...EXPORTS],
  providers: [...PROVIDERS, ...API_SERVICES]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import CoreModule in the AppModule only.`);
    }
  }
}
