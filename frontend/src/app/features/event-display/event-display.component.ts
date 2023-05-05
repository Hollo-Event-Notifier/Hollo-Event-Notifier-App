import {Component} from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {EventDto} from "../../core/api";
import {Observable} from "rxjs";
import {EventInput} from "@fullcalendar/core";
import {ApplicationStateService} from "../../core/services/application-state.service";
import {EventsService} from "../../core/services/events.service";
import {MatDialog} from "@angular/material/dialog";
import {EventEditorDialogComponent} from "../admin/components/event-editor/event-editor-dialog.component";
import {EventEditorMode} from "../admin/enums/event-editor-mode";
import {EventEditorData} from "../admin/models/event-editor-data";
import {instanceOfEventDto} from "../../core/utils/event-dto.type-guard";
import {EventDisplayDialogComponent} from "./components/event-display/event-display-dialog.component";

interface EventDisplayDialogData {
}

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
  imports: [
    SharedModule,
  ],
  standalone: true
})
export class EventDisplayComponent {
  events$!: Observable<EventInput[]>;

  constructor(
    private readonly state: ApplicationStateService,
    private readonly eventsService: EventsService,
    private readonly matDialog: MatDialog,
  ) {
    this.events$ = state.events;
    // TODO: generic solution
    this.eventsService.getEvents(new Date('2023-04-23T00:00:00.000Z'), new Date('2023-05-07T23:59:59.000Z'));
  }

  onEventClick($event: EventDto) {
    this.matDialog.open(EventDisplayDialogComponent, {data: $event});
  }
}
