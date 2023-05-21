import {EventInput} from "@fullcalendar/core";
import {UserDto} from "../api";

export interface ApplicationState {
  events: EventInput[],
  users: UserDto[]
}
