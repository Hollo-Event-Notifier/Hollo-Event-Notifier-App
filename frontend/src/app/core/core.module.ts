import {NgModule, Optional, Provider, SkipSelf} from '@angular/core';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ApplicationStateService} from "./services/application-state.service";
import {SnackbarService} from "./services/snackbar.service";
import {ApiModule, BASE_PATH, Configuration, UsersApiService} from "./api";
import {HttpClientModule} from "@angular/common/http";
import {AuthGuardService} from "./services/auth-guard.service";
import {EventMapperService} from "./services/event-mapper.service";
import {EventsService} from "./services/events.service";
import {TranslationService} from "./services/translation.service";
import {TranslocoRootModule} from "./transloco-root.module";
import {UsersService} from "./services/users.service";

const IMPORTS = [
  MatSnackBarModule,
  TranslocoRootModule,
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
  EventsService,
  EventMapperService,
  UsersService,
  TranslationService,
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
