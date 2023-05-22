import {EventInput} from "@fullcalendar/core";
import {Language} from "./language";
import {User} from "./user";

export interface ApplicationState {
  events: EventInput[],
  users: User[],
  currentUser: User
  language: Language
}
