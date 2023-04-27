import {Injectable} from '@angular/core';
import {EventDto, EventsApiService} from "../../../core/api";
import {ApplicationStateService} from "../../../core/services/application-state.service";
import {EventApi, EventInput} from "@fullcalendar/core";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private readonly eventsApiService: EventsApiService,
    private readonly state: ApplicationStateService
  ) {
  }

  getEvents(startDate: Date, endDate: Date) {
    this.eventsApiService.getEvents(startDate.toISOString(), endDate.toISOString())
      .subscribe({
        next: events => {
          const eventInputs: EventInput[] = events.map(event => {
            return {
              id: event.id,
              start: new Date(event.startDate),
              end: new Date(event.endDate),
              title: event.title,
            }
          });
          this.state.patchState({events: eventInputs})
        }
      });
  }
}
