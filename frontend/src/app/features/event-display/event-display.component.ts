import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {CalendarOptions, DateSelectArg, EventClickArg, EventInput} from "@fullcalendar/core";
import {createEventId} from "./utils/event-utils";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {ApplicationStateService} from "../../core/services/application-state.service";
import {EventsService} from "./services/events.service";
import {Observable, Subject} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {EventEditorComponent} from "./components/event-editor.component";

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    AsyncPipe,
    MatDialogModule
  ],
})
export class EventDisplayComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
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
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
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
    private matDialog: MatDialog
  ) {
    this.events$ = this.state.events;

  }

  ngOnInit(): void {
    this.eventsService.getEvents(new Date('2023-04-23T00:00:00.000Z'), new Date('2023-04-29T00:00:00.000Z'))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.matDialog.open(EventEditorComponent,
      {
        data: {
          //EventDto
          title: "title",
          place: "place",
          organizer: "organizer",
          hasPoints: "hasPoints",
          startDate: "startDate",
          endDate: "endDate",
          link: "link",
          id: "id"
        }
      });
  }
}
