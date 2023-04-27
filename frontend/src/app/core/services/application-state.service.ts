import {Injectable} from '@angular/core';
import {ApplicationState} from "../models/application-state";
import {BehaviorSubject, map, Observable} from "rxjs";
import {EventDto} from "../api";
import {EventApi, EventInput} from "@fullcalendar/core";

@Injectable()
export class ApplicationStateService {

  private state: BehaviorSubject<ApplicationState> = new BehaviorSubject<ApplicationState>({
    events: []
  });

  get events(): Observable<EventInput[]> {
    return this.state
      .asObservable()
      .pipe(
        map(state => state.events)
      );
  }

  patchState(newState: Partial<ApplicationState>) {
    this.state.next({
      ...this.state.getValue(),
      ...newState
    });
  }
}
