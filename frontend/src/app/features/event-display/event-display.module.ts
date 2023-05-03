import {NgModule, Provider} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {EventEditorDialogComponent} from "./components/event-editor/event-editor-dialog.component";
import {EventsService} from "./services/events.service";
import {EventMapperService} from "./services/event-mapper.service";
import {EventDisplayComponent} from "./components/event-display/event-display.component";
import {EventDisplayRoutingModule} from "./event-display-routing.module";

const IMPORTS = [
  SharedModule,
  MatDialogModule,
  EventDisplayRoutingModule
];

const DECLARATIONS = [
  EventEditorDialogComponent,
  EventDisplayComponent
];

const PROVIDER: Provider[] = [
  EventsService,
  EventMapperService
];


@NgModule({
  imports: [...IMPORTS],
  providers: [...PROVIDER],
  declarations: [...DECLARATIONS]
})
export class EventDisplayModule {
}
