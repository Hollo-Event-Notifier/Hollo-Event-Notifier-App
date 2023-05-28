import {Injectable} from '@angular/core';
import {EventDto, EventsApiService} from "../api";
import {ApplicationStateService} from "./application-state.service";
import {EventInput} from "@fullcalendar/core";
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

  updateEvent(eventToUpdate: EventDto): void {
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
