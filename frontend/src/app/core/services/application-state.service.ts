import {Injectable} from '@angular/core';
import {ApplicationState} from "../models/application-state";
import {BehaviorSubject, map, Observable} from "rxjs";
import {EventInput} from "@fullcalendar/core";
import {UserDtoRoleEnum} from "../api";
import {instanceOfCalendarEvent} from "../utils/calendar-event.type-guard";
import {Language} from "../models/language";
import {User} from "../models/user";
import {instanceOfUser} from "../utils/user.type-guard";

@Injectable()
export class ApplicationStateService {
  private state: BehaviorSubject<ApplicationState> = new BehaviorSubject<ApplicationState>({
    events: [],
    language: Language.Hu,
    users: [],
    currentUser: {
      id: '',
      username: '',
      email: '',
      role: UserDtoRoleEnum.EventAdmin,
      userType: 'current'
    }
  });

  get users$(): Observable<User[]> {
    return this.state
      .asObservable()
      .pipe(
        map(state => state.users)
      );
  }

  get events$(): Observable<EventInput[]> {
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

  get currentUser$(): Observable<User> {
    return this.state
      .asObservable()
      .pipe(
        map(state => state.currentUser)
      );
  }

  patchState(newState: Partial<ApplicationState> | EventInput | User | string) {
    const oldState = this.state.getValue();
    if (typeof newState === 'string') {
      // deleted event or user by id
      const eventIndex = oldState.events.findIndex(event => event.id === newState);
      const userIndex = oldState.users.findIndex(user => user.id === newState);
      if (eventIndex !== -1) {
        oldState.events = oldState.events.filter(event => event.id !== newState);
      } else if (userIndex !== -1) {
        oldState.users = oldState.users.filter(user => user.id !== newState);
      }
      this.state.next({...oldState});
    } else if (instanceOfCalendarEvent(newState)) {
      // updated or newly created event
      const index = oldState.events.findIndex(event => event.id === newState.id);
      index !== -1 ? oldState.events[index] = newState : oldState.events.push(newState);
      this.state.next({...oldState, events: [...oldState.events]});
    } else if (instanceOfUser(newState)) {
      // user is passed to patchstate
      switch (newState.userType) {
        case 'current': {
          // current user
          this.state.next({
            ...oldState,
            currentUser: newState
          });
          break;
        }
        case 'other': {
          // updated or newly created user
          const index = oldState.users.findIndex(user => user.id === newState.id);
          index !== -1 ? oldState.users[index] = newState : oldState.users.push(newState);
          this.state.next({...oldState, users: [...oldState.users]});
        }
      }
    } else {
      // newState is Partial<ApplicationState>
      this.state.next({
        ...oldState,
        ...newState
      });
    }
  }
}
