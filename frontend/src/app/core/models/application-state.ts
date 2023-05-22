import {EventInput} from "@fullcalendar/core";
import {User} from "./user";

export interface ApplicationState {
  events: EventInput[],
  users: User[],
  currentUser: User
}
