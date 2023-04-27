import {Injectable} from '@angular/core';
import {EventDto, EventsApiService} from "../../../core/api";
import {ApplicationStateService} from "../../../core/services/application-state.service";
import {EventInput} from "@fullcalendar/core";
import {EventMapperService} from "./event-mapper.service";

@Injectable()
export class EventsService {

  constructor(
    private readonly eventsApiService: EventsApiService,
    private readonly state: ApplicationStateService,
    private readonly mapper: EventMapperService
  ) {
  }

  getEvents(startDate: Date, endDate: Date) {
    this.eventsApiService.getEvents(startDate.toISOString(), endDate.toISOString())
      .subscribe({
        next: (events: EventDto[]) => {
          const eventInputs: EventInput[] = events.map(
            (event: EventDto) => this.mapper.mapEventDtoToEventInput(event)
          );
          this.state.patchState({events: eventInputs})
        }
      });
  }
}
