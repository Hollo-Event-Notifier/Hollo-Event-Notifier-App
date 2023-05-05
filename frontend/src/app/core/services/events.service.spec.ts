import {EventsService} from './events.service';
import {EventDto, EventsApiService, EventsApiServiceInterface} from '../api';
import {ApplicationStateService} from './application-state.service';
import {EventMapperService} from './event-mapper.service';
import {SnackbarService} from './snackbar.service';
import {TestBed} from "@angular/core/testing";
import {Provider} from "@angular/core";
import {of} from "rxjs";
import {EventInput} from "@fullcalendar/core";

describe('EventsService', () => {
  let underTest: EventsService;
  let eventsApiServiceSpy: jasmine.SpyObj<EventsApiServiceInterface>;
  let stateSpy: jasmine.SpyObj<ApplicationStateService>;
  let mapperSpy: jasmine.SpyObj<EventMapperService>;
  let snackbarSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(() => {
    eventsApiServiceSpy = jasmine.createSpyObj('EventsApiService', ['getEvents', 'updateEventById', 'createEvent', 'deleteEventById']);
    stateSpy = jasmine.createSpyObj('ApplicationStateService', ['patchState']);
    mapperSpy = jasmine.createSpyObj('EventMapperService', ['mapEventDtoToCalendarEvent']);
    snackbarSpy = jasmine.createSpyObj('SnackbarService', ['open']);

    TestBed.configureTestingModule({
      providers: [
        {provide: EventsApiService, useValue: eventsApiServiceSpy},
        {provide: ApplicationStateService, useValue: stateSpy},
        {provide: EventMapperService, useValue: mapperSpy},
        {provide: SnackbarService, useValue: snackbarSpy},
        EventsService
      ] as Provider[]
    });
    underTest = TestBed.inject(EventsService);
  });

  it('should get events and update the state', () => {
    // Arrange
    const startDate = new Date();
    const endDate = new Date();
    const eventDto: EventDto = {
      id: '1',
      title: 'Test event',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      hasPoints: false,
      organizer: 'Test organizer',
      place: 'Test place'
    };
    const eventInput = {
      id: '1',
      title: 'Test event',
      start: startDate,
      end: endDate
    }
    eventsApiServiceSpy.getEvents.and.returnValue(of([eventDto]));
    mapperSpy.mapEventDtoToCalendarEvent.and.returnValue(eventInput);

    // Act
    underTest.getEvents(startDate, endDate);

    // Assert
    expect(eventsApiServiceSpy.getEvents).toHaveBeenCalledWith(startDate.toISOString(), endDate.toISOString());
    expect(mapperSpy.mapEventDtoToCalendarEvent).toHaveBeenCalledWith(eventDto);
    expect(stateSpy.patchState).toHaveBeenCalledWith({events: [eventInput]});
  });

  it('should update an event and update the state', () => {
    // Arrange
    const eventToUpdate: EventDto = {id: '1', title: 'Test event'} as EventDto;
    const updatedEvent: EventDto = {id: '1', title: 'Updated event'} as EventDto;
    mapperSpy.mapEventDtoToCalendarEvent.and.returnValue(updatedEvent);
    eventsApiServiceSpy.updateEventById.and.returnValue(of(updatedEvent));

    // Act
    underTest.updateEvent(eventToUpdate);

    // Assert
    expect(eventsApiServiceSpy.updateEventById).toHaveBeenCalledWith('1', eventToUpdate);
    expect(mapperSpy.mapEventDtoToCalendarEvent).toHaveBeenCalledWith(updatedEvent);
    expect(stateSpy.patchState).toHaveBeenCalledWith(updatedEvent);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Event updated successfully!');
  });

  it('should update event and call patchState and snackbar service on success', () => {
    // Arrange
    const eventToUpdate: EventDto = {
      id: '1',
      title: 'Updated Event',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString()
    } as EventDto;
    const updatedEvent: EventDto = {
      id: '1',
      title: 'Updated Event',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString()
    } as EventDto;
    eventsApiServiceSpy.updateEventById.and.returnValue(of(updatedEvent));
    mapperSpy.mapEventDtoToCalendarEvent.and.returnValue(updatedEvent);

    // Act
    underTest.updateEvent(eventToUpdate);

    // Assert
    expect(eventsApiServiceSpy.updateEventById).toHaveBeenCalledWith('1', eventToUpdate);
    expect(mapperSpy.mapEventDtoToCalendarEvent).toHaveBeenCalledWith(updatedEvent);
    expect(stateSpy.patchState).toHaveBeenCalledWith(updatedEvent);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Event updated successfully!');
  });

  it('should patch the state with the provided idToDelete on successful deletion', () => {
    // Arrange
    const idToDelete = '12345';
    eventsApiServiceSpy.deleteEventById.and.returnValue(of({}));

    // Act
    underTest.deleteEvent(idToDelete);

    // Assert
    expect(stateSpy.patchState).toHaveBeenCalledWith(idToDelete);
  });

  it('should open a snackbar with the success message on successful deletion', () => {
    // Arrange
    const idToDelete = '12345';
    eventsApiServiceSpy.deleteEventById.and.returnValue(of({}));

    // Act
    underTest.deleteEvent(idToDelete);

    // Assert
    expect(snackbarSpy.open).toHaveBeenCalledWith('Event deleted successfully!');
  });

  it('should call createEvent and patchState with mapped event when called', () => {
    // Arrange
    const eventToCreate = {id: '1', title: 'Test Event'} as EventDto;
    const createdEvent = {id: '1', title: 'Test Event'} as EventDto;
    const mappedEvent = {id: '1', title: 'Test Event', start: new Date(), end: new Date()} as EventInput;
    eventsApiServiceSpy.createEvent.and.returnValue(of(createdEvent));
    mapperSpy.mapEventDtoToCalendarEvent.and.returnValue(mappedEvent);

    // Act
    underTest.createEvent(eventToCreate);

    // Assert
    expect(eventsApiServiceSpy.createEvent).toHaveBeenCalledWith(eventToCreate);
    expect(mapperSpy.mapEventDtoToCalendarEvent).toHaveBeenCalledWith(createdEvent);
    expect(stateSpy.patchState).toHaveBeenCalledWith(mappedEvent);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Event created successfully!');
  });
});


