import {Injectable} from '@angular/core';
import {ApplicationState} from "../models/application-state";
import {BehaviorSubject, map, Observable} from "rxjs";
import {EventInput} from "@fullcalendar/core";
import {instanceOfCalendarEvent} from "../utils/calendar-event.type-guard";
import {Language} from "../models/language";

@Injectable()
export class ApplicationStateService {

  private state: BehaviorSubject<ApplicationState> = new BehaviorSubject<ApplicationState>({
    events: [],
    language: Language.Hu
  });

  get events(): Observable<EventInput[]> {
    return this.state
      .asObservable()
      .pipe(
        map(state => state.events)
      );
  }

  get language(): Observable<Language> {
    return this.state
      .asObservable()
      .pipe(
        map(state => state.language)
      );
  }

  patchState(newState: Partial<ApplicationState> | EventInput | string) {
    const oldState = this.state.getValue();

    if (typeof newState === 'string') {
      oldState.events = oldState.events.filter(event => event.id !== newState);
      this.state.next({...oldState});
    } else if (instanceOfCalendarEvent(newState)) {
      const index = oldState.events.findIndex(event => event.id === newState.id);
      index !== -1 ? oldState.events[index] = newState : oldState.events.push(newState);
      this.state.next({...oldState, events: [...oldState.events]});
    } else {
      this.state.next({
        ...this.state.getValue(),
        ...newState
      });
    }
  }
}
