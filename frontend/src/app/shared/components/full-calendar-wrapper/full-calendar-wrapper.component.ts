import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  Calendar,
  CalendarOptions,
  DateSelectArg,
  DatesSetArg,
  EventChangeArg,
  EventClickArg,
  EventInput
} from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import {EventDto} from "../../../core/api";
import {EventMapperService} from "../../../core/services/event-mapper.service";
import {Language} from "../../../core/models/language";
import {ApplicationStateService} from "../../../core/services/application-state.service";
import {Subscription} from 'rxjs';
import {EventsService} from "../../../core/services/events.service";

@Component({
  selector: 'app-full-calendar-wrapper',
  templateUrl: './full-calendar-wrapper.component.html',
  styleUrls: ['./full-calendar-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FullCalendarWrapperComponent implements OnInit, OnDestroy {
  @Output('dateSelect') dateSelectEmitter = new EventEmitter<EventDto>();
  @Output('eventClick') eventClickEmitter = new EventEmitter<EventDto>();
  @Output('eventChange') eventChangeEmitter = new EventEmitter<EventDto>();
  @Output('eventAdd') eventAddEmitter = new EventEmitter<EventDto>();
  @Output('eventRemove') eventRemoveEmitter = new EventEmitter<EventDto>();

  @Input() events: EventInput[] = [];
  @Input() isEditable: boolean = false;
  @Input() hasWeekends: boolean = false;
  @Input() isSelectable: boolean = false;

  @ViewChild('fullCalendar') fullCalendar: Calendar | undefined;

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
    selectMirror: true,
    dayMaxEvents: true,
    firstDay: 1,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventChange: this.handleEventChange.bind(this),
    datesSet: this.handleDateSet.bind(this)
  };

  private languageSubscription!: Subscription;

  private loaded: boolean = false;

  private realLifeDate: Date = new Date();
  private realLifeMonthStart: Date = new Date(this.realLifeDate.getFullYear(), this.realLifeDate.getMonth() + 1, 1);
  private realLifePreviousMonthStart: Date = new Date(this.realLifeDate.getFullYear(), this.realLifeDate.getMonth(), 1);
  private realLifeMonthEnd: Date = new Date(this.realLifeDate.getFullYear(), this.realLifeDate.getMonth() + 2, 0);
  private realLifeNextMonthEnd: Date = new Date(this.realLifeDate.getFullYear(), this.realLifeDate.getMonth() + 3, 0);

  private currentMonthStart: Date = this.realLifeMonthStart;
  private currentMonthEnd: Date = this.realLifeMonthEnd;
  private nextMonthEnd: Date = this.realLifeNextMonthEnd;
  private previousMonthStart: Date = this.realLifePreviousMonthStart;

  constructor(
    private readonly state: ApplicationStateService,
    private readonly eventMapperService: EventMapperService,
    private readonly eventsService: EventsService
  ) {
  }

  ngOnInit(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      weekends: this.hasWeekends,
      editable: this.isEditable,
      selectable: this.isSelectable,
      locale: Language.Hu,
    }
    this.languageSubscription = this.state.language
      .subscribe(language => {
        this.changeLanguage(language);
      });
  }

  handleDateSet(datesSetArgs: DatesSetArg) {
    let viewStartDate: Date = datesSetArgs.start;
    let viewEndDate: Date = datesSetArgs.end;

    if (!this.loaded) {
      this.loaded = true;
    } else if (viewStartDate < this.currentMonthStart) {
      this.currentMonthStart = new Date(this.currentMonthStart.getFullYear(), this.currentMonthStart.getMonth() - 1, 1);
      this.currentMonthEnd = new Date(this.currentMonthEnd.getFullYear(), this.currentMonthEnd.getMonth(), 0);

      this.previousMonthStart = new Date(this.currentMonthStart.getFullYear(), this.currentMonthStart.getMonth() - 1, 1);
      this.nextMonthEnd = new Date(this.currentMonthEnd.getFullYear(), this.currentMonthEnd.getMonth() + 2, 0);
    } else if (viewEndDate > this.currentMonthEnd) {
      this.currentMonthStart = new Date(this.currentMonthStart.getFullYear(), this.currentMonthStart.getMonth() + 1, 1);
      this.currentMonthEnd = new Date(this.currentMonthEnd.getFullYear(), this.currentMonthEnd.getMonth() + 2, 0);

      this.previousMonthStart = new Date(this.currentMonthStart.getFullYear(), this.currentMonthStart.getMonth() - 1, 1);
      this.nextMonthEnd = new Date(this.currentMonthEnd.getFullYear(), this.currentMonthEnd.getMonth() + 2, 0);
    }

    this.eventsService.getEvents(this.previousMonthStart, this.nextMonthEnd);
  }


  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private handleDateSelect(selectInfo: DateSelectArg): void {
    selectInfo.view.calendar.unselect();

    this.dateSelectEmitter.emit({
      startDate: selectInfo.start.toISOString(),
      endDate: selectInfo.end.toISOString(),
      link: '',
      place: '',
      title: '',
      organizer: '',
      hasPoints: false
    });
  }

  private handleEventClick(clickInfo: EventClickArg): void {
    this.eventClickEmitter.emit(
      this.eventMapperService.mapCalendarEventToEventDto(clickInfo.event)
    );
  }

  private handleEventChange(changeInfo: EventChangeArg) {
    this.eventChangeEmitter.emit(
      this.eventMapperService.mapCalendarEventToEventDto(changeInfo.event)
    );
  }

  private changeLanguage(language: Language): void {
    this.calendarOptions.locale = language;
    switch (language) {
      case Language.En: {
        this.calendarOptions.buttonText = {
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List'
        };
        break;
      }
      case Language.Hu: {
        this.calendarOptions.buttonText = {
          today: 'Ma',
          month: 'Hónap',
          week: 'Hét',
          day: 'Nap',
          list: 'Lista'
        };
        break;
      }
    }
  }
}
