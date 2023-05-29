import {TestBed} from '@angular/core/testing';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApplicationStateService} from './application-state.service';
import {Language} from '../models/language';
import {User} from '../models/user';
import {UserDtoRoleEnum} from '../api';
import {ApplicationState} from "../models/application-state";

describe('ApplicationStateService', () => {
  let applicationStateService: ApplicationStateService;
  let state: BehaviorSubject<ApplicationState>;

  beforeEach(() => {
    state = new BehaviorSubject<ApplicationState>({
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

    TestBed.configureTestingModule({
      providers: [ApplicationStateService]
    });

    applicationStateService = TestBed.inject(ApplicationStateService);
    applicationStateService['state'] = state;
  });

  it('should be created', () => {
    // Arrange

    // Act

    // Assert
    expect(applicationStateService).toBeTruthy();
  });

  it('should return an observable of users', () => {
    // Arrange
    const users: User[] = [
      {id: '1', username: 'user1'} as User,
      {id: '2', username: 'user2'} as User
    ];
    state.next({...state.getValue(), users});

    // Act
    const users$ = applicationStateService.users$;

    // Assert
    users$.subscribe((result) => {
      expect(result).toEqual(users);
    });
  });

  it('should return an observable of events', () => {
    // Arrange
    const events = [{id: '1', title: 'event1'}, {id: '2', title: 'event2'}];
    state.next({...state.getValue(), events});

    // Act
    const events$ = applicationStateService.events$;

    // Assert
    events$.subscribe((result) => {
      expect(result).toEqual(events);
    });
  });

  it('should return an observable of the current language', () => {
    // Arrange
    const language = Language.En;
    state.next({...state.getValue(), language});

    // Act
    const language$ = applicationStateService.language;

    // Assert
    language$.subscribe((result) => {
      expect(result).toEqual(language);
    });
  });

  it('should return an observable of the current user', () => {
    // Arrange
    const currentUser: User = {
      id: '1',
      username: 'user1',
      email: 'user1@example.com',
      role: UserDtoRoleEnum.EventAdmin,
      userType: 'current'
    };
    state.next({...state.getValue(), currentUser});

    // Act
    const currentUser$ = applicationStateService.currentUser$;

    // Assert
    currentUser$.subscribe((result) => {
      expect(result).toEqual(currentUser);
    });
  });

  it('should update the state with a partial application state', () => {
    // Arrange
    const partialState = {language: Language.En};

    // Act
    applicationStateService.patchState(partialState);

    // Assert
    state.pipe(map((result) => result.language)).subscribe((result) => {
      expect(result).toEqual(Language.En);
    });
  });

  it('should delete an event or user by ID when string is passed', () => {
    // Arrange
    const event = {id: '1', title: 'event1'};
    const user = {id: '2', username: 'user1'} as User;
    state.next({...state.getValue(), events: [event], users: [user]});

    // Act
    applicationStateService.patchState('1');
    applicationStateService.patchState('2');

    // Assert
    state.pipe(map((result) => ({events: result.events, users: result.users}))).subscribe((result) => {
      expect(result.events.length).toBe(0);
      expect(result.users.length).toBe(0);
    });
  });

  it('should update or create an event when EventInput is passed', () => {
    // Arrange
    const event: any = {id: '1', title: 'event1'};
    state.next({...state.getValue(), events: [event]});

    // Act
    applicationStateService.patchState(event);

    // Assert
    state.pipe(map((result) => result.events)).subscribe((result) => {
      expect(result).toEqual([event]);
    });
  });

  it('should update the current user', () => {
    // Arrange
    const currentUser: User = {
      id: '1',
      username: 'user1',
      email: 'user1@example.com',
      role: UserDtoRoleEnum.EventAdmin,
      userType: 'current'
    };
    const newUser: User = {
      id: '2',
      username: 'user2',
      email: 'user2@example.com',
      role: UserDtoRoleEnum.SystemAdmin,
      userType: 'current'
    };
    state.next({...state.getValue(), currentUser, users: []});

    // Act
    applicationStateService.patchState(newUser);

    // Assert
    state.pipe(map((result) => ({currentUser: result.currentUser, users: result.users}))).subscribe((result) => {
      expect(result.currentUser).toEqual(newUser);
    });
  });
});
