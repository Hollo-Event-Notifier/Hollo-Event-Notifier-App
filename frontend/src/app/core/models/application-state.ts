import {EventDto} from "../api";
import {EventApi, EventInput} from "@fullcalendar/core";

export interface ApplicationState {
  events: EventInput[]
}
