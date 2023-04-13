import {NgModule, Optional, Provider, SkipSelf} from '@angular/core';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ApplicationStateService} from "./services/application-state.service";
import {SnackbarService} from "./services/snackbar.service";
import {ApiModule, BASE_PATH, Configuration, UsersApiService} from "./api";
import {HttpClientModule} from "@angular/common/http";
import {AuthGuardService} from "./services/auth-guard.service";

const IMPORTS = [
  MatSnackBarModule,
  HttpClientModule,
  ApiModule.forRoot(() => {
    const config = new Configuration()
    config.withCredentials = true
    return config
  }),
];

// TODO: Delete never type
const EXPORTS: never[] = [];

const PROVIDERS: Provider[] = [
  {provide: BASE_PATH, useValue: 'http://localhost:8080'},
  ApplicationStateService,
  SnackbarService,
  AuthGuardService,
];

const API_SERVICES: Provider[] = [
  UsersApiService
];

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
