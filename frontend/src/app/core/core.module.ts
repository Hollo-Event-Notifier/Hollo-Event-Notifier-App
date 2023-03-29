import {NgModule, Optional, Provider, SkipSelf} from '@angular/core';
import {MatSnackBarModule} from "@angular/material/snack-bar";

const IMPORTS = [
  MatSnackBarModule
];

// TODO: Delete never type
const EXPORTS: never[] = [];

const PROVIDERS: Provider[] = [];

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
