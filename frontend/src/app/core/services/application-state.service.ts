import {Injectable} from '@angular/core';
import {ApplicationState} from "../models/application-state";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ApplicationStateService {

  private state: BehaviorSubject<ApplicationState> = new BehaviorSubject<ApplicationState>({});

  patchState(newState: Partial<ApplicationState>) {
    this.state.next({
      ...this.state.getValue(),
      ...newState
    });
  }
}
