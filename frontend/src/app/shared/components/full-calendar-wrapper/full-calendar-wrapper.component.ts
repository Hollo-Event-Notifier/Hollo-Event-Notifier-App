import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventAddArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
  EventRemoveArg
} from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import {EventDto} from "../../../core/api";
import {EventMapperService} from "../../../core/services/event-mapper.service";
import {Language} from "../../../core/models/language";
import {ApplicationStateService} from "../../../core/services/application-state.service";
import { Subscription } from 'rxjs';

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
    eventAdd: this.handleEventAdd.bind(this),
    eventRemove: this.handleEventRemove.bind(this),
  };

  private languageSubscription: Subscription | undefined;

  constructor(
    private readonly state: ApplicationStateService,
    private readonly eventMapperService: EventMapperService
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

  private handleEventAdd(addInfo: EventAddArg): void {
  }

  private handleEventRemove(removeInfo: EventRemoveArg): void {
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
