import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SharedModule} from "../../../../shared/shared.module";
import {CalendarOptions, DateSelectArg, EventClickArg, EventInput} from "@fullcalendar/core";
import {createEventId} from "../../utils/event-utils";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {ApplicationStateService} from "../../../../core/services/application-state.service";
import {EventsService} from "../../services/events.service";
import {Observable, Subject} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {EventEditorDialogComponent} from "../event-editor/event-editor-dialog.component";
import {EventMapperService} from "../../services/event-mapper.service";
import {cl} from "@fullcalendar/core/internal-common";

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
    private readonly eventMapperService: EventMapperService,
    private readonly matDialog: MatDialog,
  ) {
    this.events$ = this.state.events;
    this.events$.subscribe(value => console.log(value))
  }

  ngOnInit(): void {
    this.eventsService.getEvents(new Date('2023-04-23T00:00:00.000Z'), new Date('2023-04-29T00:00:00.000Z'))
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
    this.matDialog.open(EventEditorDialogComponent, {data: clickInfo.event})
      .afterClosed().subscribe(value => console.log(value));
  }
}
