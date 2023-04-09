import {NgModule} from '@angular/core';
import {AdminRootComponent} from './components/admin-root/admin-root.component';
import {AdminRoutingModule} from "./admin-routing.module";
import {SharedModule} from "../../shared/shared.module";
import { SettingsComponent } from './components/settings/settings.component';

const DECLARATIONS = [
  AdminRootComponent,
  SettingsComponent
];

const IMPORTS = [
  AdminRoutingModule,
  SharedModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS]
})
export class AdminModule {
}
