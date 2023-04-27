import {Injectable} from '@angular/core';
import {EventDto} from "../../../core/api";
import {EventInput} from "@fullcalendar/core";

@Injectable()
export class EventMapperService {

  constructor() {
  }

  mapEventDtoToEventInput(dto: EventDto): EventInput {
    return {
      id: dto.id,
      start: new Date(dto.startDate),
      end: new Date(dto.endDate),
      title: dto.title,
      extendedProps: {
        place: dto.place,
        organizer: dto.organizer,
        hasPoints: dto.hasPoints
      }
    }
  }

  mapEventInputToEventDto(input: EventInput): EventDto {
    return {
      title: input.title!!,
      place: input.extendedProps!!['place'],
      organizer: input.extendedProps!!['organizer'],
      hasPoints: input.extendedProps!!['hasPoints'],
      startDate: new Date(input.start!!.toString()).toISOString(),
      endDate: new Date(input.end!!.toString()).toISOString(),
      id: input.id!!,
      link: input.url!!
    }
  }
}
