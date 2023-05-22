import {EventInput} from "@fullcalendar/core";
import {Language} from "./language";

export interface ApplicationState {
  events: EventInput[],
  language: Language
}
