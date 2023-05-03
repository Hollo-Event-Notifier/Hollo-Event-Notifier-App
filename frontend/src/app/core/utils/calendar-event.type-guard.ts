import {EventInput} from "@fullcalendar/core";

export function instanceOfCalendarEvent(object: any): object is EventInput {
  if (!('extendedProps' in object)) {
    return false;
  }

  return 'id' in object &&
    'start' in object &&
    'end' in object &&
    'title' in object &&
    'extendedProps' in object &&
    'place' in object.extendedProps &&
    'organizer' in object.extendedProps &&
    'hasPoints' in object.extendedProps &&
    'link' in object.extendedProps;
}
