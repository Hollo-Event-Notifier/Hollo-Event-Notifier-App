import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {EventInput} from "@fullcalendar/core";
import {ApplicationStateService} from "../../../../core/services/application-state.service";
import {EventsService} from "../../../../core/services/events.service";
import {EventMapperService} from "../../../../core/services/event-mapper.service";
import {MatDialog} from "@angular/material/dialog";
import {EventDto} from "../../../../core/api";
import {EventEditorDialogComponent} from "../event-editor/event-editor-dialog.component";
import {EventEditorMode} from "../../enums/event-editor-mode";
import {EventEditorData} from "../../models/event-editor-data";
import {instanceOfEventDto} from "../../../../core/utils/event-dto.type-guard";

@Component({
  selector: 'app-admin-event-display',
  templateUrl: './admin-event-display.component.html',
  styleUrls: ['./admin-event-display.component.scss']
})
export class AdminEventDisplayComponent implements OnInit {
  events$!: Observable<EventInput[]>;

  constructor(
    private readonly state: ApplicationStateService,
    private readonly eventsService: EventsService,
    private readonly eventMapperService: EventMapperService,
    private readonly matDialog: MatDialog,
  ) {
    this.events$ = this.state.events;
  }

  ngOnInit(): void {
    // TODO: generic solution
    this.eventsService.getEvents(new Date('2023-04-23T00:00:00.000Z'), new Date('2023-05-13T23:59:59.000Z'));
  }

  onDateSelect(emptyEventWithDates: EventDto) {
    this.openCreateDialog(emptyEventWithDates);
  }

  onEventClick(eventToUpdate: EventDto): void {
    this.matDialog.open(EventEditorDialogComponent, {
      data: {
        event: eventToUpdate,
        mode: EventEditorMode.Update
      } as EventEditorData
    }).afterClosed().subscribe((value: EventDto | string) => {
      if (value !== undefined) {
        if (typeof value === 'string') {
          this.eventsService.deleteEvent(value);
        } else if (instanceOfEventDto(value)) {
          this.eventsService.updateEvent(value);
        }
      }
    });
  }

  onEventChange(eventToUpdate: EventDto): void {
    this.eventsService.updateEvent(eventToUpdate);
  }

  onFabClick(): void {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1)
    this.openCreateDialog({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      hasPoints: false,
      organizer: '',
      place: '',
      title: ''
    });
  }

  private openCreateDialog(event: EventDto): void {
    this.matDialog.open(EventEditorDialogComponent, {
      data: {
        event: event,
        mode: EventEditorMode.Create
      } as EventEditorData
    }).afterClosed().subscribe((value: EventDto) => {
      if (value !== undefined && instanceOfEventDto(value)) {
        this.eventsService.createEvent(value);
      }
    });
  }
}
