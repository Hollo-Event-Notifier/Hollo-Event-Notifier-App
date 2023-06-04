import {Injectable} from '@angular/core';
import {EventDto} from "../api";
import {EventInput} from "@fullcalendar/core";
import {EventImpl} from "@fullcalendar/core/internal";

@Injectable()
export class EventMapperService {

  constructor() {
  }

  mapEventDtoToCalendarEvent(dto: EventDto): EventInput {
    return {
      id: dto.id,
      start: new Date(dto.startDate),
      end: new Date(dto.endDate),
      title: dto.title,
      extendedProps: {
        place: dto.place,
        organizer: dto.organizer,
        hasPoints: dto.hasPoints,
        link: dto.link,
        type: dto.type
      },
      backgroundColor: dto.type === 'Professional' ? '#3f51b5': (dto.type === 'Community' ? '#1c8f15' : '#F09300')
    }
  }

  mapCalendarEventToEventDto(input: EventInput | EventImpl): EventDto {
    return {
      title: input.title!!,
      place: input.extendedProps!!['place'],
      organizer: input.extendedProps!!['organizer'],
      hasPoints: input.extendedProps!!['hasPoints'],
      startDate: new Date(input.start!!.toString()).toISOString(),
      endDate: new Date(input.end!!.toString()).toISOString(),
      id: input.id!!,
      link: input.extendedProps!!['link'],
      type:input.extendedProps!!['type'],
    }
  }
}
