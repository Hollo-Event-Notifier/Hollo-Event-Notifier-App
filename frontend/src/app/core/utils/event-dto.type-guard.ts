import {EventDto} from "../api";

export function instanceOfEventDto(object: object): object is EventDto {
  return 'title' in object &&
    'place' in object &&
    'organizer' in object &&
    'hasPoints' in object &&
    'startDate' in object &&
    'endDate' in object
}
