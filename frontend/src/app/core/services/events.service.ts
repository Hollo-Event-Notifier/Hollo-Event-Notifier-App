import {Injectable} from '@angular/core';
import {EventDto, EventsApiService} from "../api";
import {ApplicationStateService} from "./application-state.service";
import {Calendar, EventInput} from "@fullcalendar/core";
import {EventMapperService} from "./event-mapper.service";
import {SnackbarService} from "./snackbar.service";

@Injectable()
export class EventsService {

  constructor(
    private readonly eventsApiService: EventsApiService,
    private readonly state: ApplicationStateService,
    private readonly mapper: EventMapperService,
    private readonly snackbar: SnackbarService
  ) {
  }

  getEvents(startDate: Date, endDate: Date): void {
    this.eventsApiService.getEvents(startDate.toISOString(), endDate.toISOString())
      .subscribe({
        next: (events: EventDto[]) => {
          const eventInputs: EventInput[] = events.map(
            (event: EventDto) => this.mapper.mapEventDtoToCalendarEvent(event)
          );
          this.state.patchState({events: eventInputs})
        }
      });
  }

  getEventsForCurrentView(calendar: Calendar): void {
    const currentView = calendar.view;

    const currentDate: Date = new Date();
    const currentMonthStart: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const previousMonthStart: Date = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 1, 1);
    const nextMonthEnd: Date = new Date(currentMonthEnd.getFullYear(), currentMonthEnd.getMonth() + 2, 0);

    let startDate: Date;
    let endDate: Date;

    switch (currentView.type) {
      case 'dayGridMonth':
      case 'timeGridWeek':
        startDate = currentMonthStart;
        endDate = currentMonthEnd;
        break;
      case 'timeGridDay':
        startDate = currentView.currentStart as Date;
        endDate = currentView.currentEnd as Date;
        break;
      default:
        startDate = previousMonthStart;
        endDate = nextMonthEnd;
        break;
    }

    this.getEvents(startDate, endDate);
  }

  updateEvent(eventToUpdate: EventDto): void {
    // TODO: add ID as required or get more types
    this.eventsApiService.updateEventById(eventToUpdate.id!!, eventToUpdate).subscribe({
      next: (updatedEvent: EventDto) => {
        this.state.patchState(this.mapper.mapEventDtoToCalendarEvent(updatedEvent));
        this.snackbar.open('Event updated successfully!');
      }
    });
  }

  createEvent(eventToCreate: EventDto): void {
    this.eventsApiService.createEvent(eventToCreate).subscribe({
      next: (createdEvent: EventDto) => {
        this.state.patchState(this.mapper.mapEventDtoToCalendarEvent(createdEvent));
        this.snackbar.open('Event created successfully!');
      }
    });
  }

  deleteEvent(idToDelete: string): void {
    this.eventsApiService.deleteEventById(idToDelete).subscribe({
      next: () => {
        this.state.patchState(idToDelete);
        this.snackbar.open('Event deleted successfully!');
      }
    });
  }
}
