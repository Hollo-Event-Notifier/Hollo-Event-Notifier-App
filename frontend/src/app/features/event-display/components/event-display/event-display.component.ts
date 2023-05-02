import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CalendarOptions, DateSelectArg, EventChangeArg, EventClickArg, EventInput} from "@fullcalendar/core";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {ApplicationStateService} from "../../../../core/services/application-state.service";
import {EventsService} from "../../services/events.service";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EventEditorDialogComponent} from "../event-editor/event-editor-dialog.component";
import {EventMapperService} from "../../services/event-mapper.service";
import {EventEditorData, EventEditorMode} from "../../models/event-editor-data";
import {EventDto} from "../../../../core/api";
import {instanceOfEventDto} from "../../utils/event-dto.type-guard";

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss']
})
export class EventDisplayComponent implements OnInit {
  events$!: Observable<EventInput[]>;

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGridWeek',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    firstDay: 1,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventChange: this.handleEventChange.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly state: ApplicationStateService,
    private readonly eventsService: EventsService,
    private readonly eventMapperService: EventMapperService,
    private readonly matDialog: MatDialog,
  ) {
    this.events$ = this.state.events;
    // this.events$.subscribe(value => changeDetector.detectChanges())
  }

  ngOnInit(): void {
    this.eventsService.getEvents(new Date('2023-04-23T00:00:00.000Z'), new Date('2023-04-29T00:00:00.000Z'))
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.matDialog.open(EventEditorDialogComponent, {
      data: {
        event: {
          startDate: selectInfo.start.toISOString(),
          endDate: selectInfo.end.toISOString(),
          link: '',
          place: '',
          title: '',
          organizer: '',
          hasPoints: false
        },
        mode: EventEditorMode.Create
      } as EventEditorData
    }).afterClosed().subscribe((value: EventDto) => {
      if (value !== undefined && instanceOfEventDto(value)) {
        this.eventsService.createEvent(value);
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const calendarApi = clickInfo.view.calendar;
    this.matDialog.open(EventEditorDialogComponent, {
      data: {
        event: this.eventMapperService.mapCalendarEventToEventDto(clickInfo.event),
        mode: EventEditorMode.Update
      } as EventEditorData
    }).afterClosed().subscribe((value: EventDto | string) => {
      // TODO: add change detection
      if (value !== undefined) {
        if (typeof value === 'string') {
          this.eventsService.deleteEvent(value);
        } else if (instanceOfEventDto(value)) {
          this.eventsService.updateEvent(value);
        }
      }
    });
  }

  handleEventChange(changeInfo: EventChangeArg) {
    this.eventsService.updateEvent(this.eventMapperService.mapCalendarEventToEventDto(changeInfo.event));
  }
}
