import {NgModule} from '@angular/core';
import {AdminRootComponent} from './components/admin-root/admin-root.component';
import {AdminRoutingModule} from "./admin-routing.module";
import {SharedModule} from "../../shared/shared.module";
import { SettingsComponent } from './components/settings/settings.component';
import { AdminEventDisplayComponent } from './components/admin-event-display/admin-event-display.component';
import {EventEditorDialogComponent} from "./components/event-editor/event-editor-dialog.component";
import {TranslocoModule} from "@ngneat/transloco";

const DECLARATIONS = [
  AdminRootComponent,
  SettingsComponent,
  AdminEventDisplayComponent,
  EventEditorDialogComponent
];

const IMPORTS = [
  AdminRoutingModule,
  SharedModule,
  TranslocoModule
];

@NgModule({
  declarations: [...DECLARATIONS],
    imports: [...IMPORTS]
})
export class AdminModule {
}
