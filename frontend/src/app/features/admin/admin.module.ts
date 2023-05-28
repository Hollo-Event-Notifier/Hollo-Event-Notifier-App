import {NgModule, Provider} from '@angular/core';
import {AdminRootComponent} from './components/admin-root/admin-root.component';
import {AdminRoutingModule} from "./admin-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {SettingsComponent} from './components/settings/settings.component';
import {AdminEventDisplayComponent} from './components/admin-event-display/admin-event-display.component';
import {EventEditorDialogComponent} from "./components/event-editor-dialog/event-editor-dialog.component";
import {UserDeleteDialogComponent} from './components/user-delete-dialog/user-delete-dialog.component';
import {UserEditorDialogComponent} from './components/user-editor-dialog/user-editor-dialog.component';
import {UserCreatorDialogComponent} from './components/user-creator-dialog/user-creator-dialog.component';
import {SettingsGuardService} from "./services/settings-guard.service";

const DECLARATIONS = [
  AdminRootComponent,
  SettingsComponent,
  AdminEventDisplayComponent,
  EventEditorDialogComponent,
  UserDeleteDialogComponent,
  UserEditorDialogComponent,
  UserCreatorDialogComponent,
];

const IMPORTS = [
  AdminRoutingModule,
  SharedModule
];

const PROVIDERS: Provider[] = [
  SettingsGuardService
]

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [...PROVIDERS]
})
export class AdminModule {
}
