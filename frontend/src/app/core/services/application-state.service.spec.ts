 import {ApplicationStateService} from './application-state.service';
 import {BehaviorSubject} from 'rxjs';
 import {ApplicationState} from "../models/application-state";
 import {EventDto} from "../api";
 import {EventInput} from "@fullcalendar/core";

 describe('ApplicationStateService', () => {
   let underTest: ApplicationStateService;
   let initialState: ApplicationState;

   beforeEach(() => {
     initialState = {
       events: []
     };
     underTest = new ApplicationStateService();
     underTest['state'] = new BehaviorSubject(initialState);
   });

   it('should emit events when accessing the events property', () => {
     // Arrange
     const spy = jasmine.createSpy('map');
     underTest.events.subscribe(spy);

     // Act
     underTest.patchState({events: [{id: '1'}]});

     // Assert
     expect(spy).toHaveBeenCalled();
   });

   it('should update events in the state with a calendar event', () => {
     // Arrange
     const eventToUpdate: EventInput = {
       id: '1',
       end: new Date().toISOString(),
       start: new Date().toISOString(),
       title: 'Test title',
       extendedProps: {
         hasPoints: false,
         organizer: 'Test organizer',
         place: 'Test place',
         link: ''
       }
     };
     underTest.patchState({events: [eventToUpdate]});
     const updatedEvent: EventInput = {
       ...eventToUpdate,
       title: 'Updated Title'
     };

     // Act
     underTest.patchState(updatedEvent);

     // Assert
     expect(underTest['state'].getValue().events).toEqual([updatedEvent]);
   });

   it('should remove events from the state by id', () => {
     // Arrange
     const eventToRemove = {id: '1'};
     underTest.patchState({events: [eventToRemove]});

     // Act
     underTest.patchState(eventToRemove.id);

     // Assert
     expect(underTest['state'].getValue().events).not.toContain(eventToRemove);
   });

   it('should update state with new values when patchState is called with an object', () => {
     // Arrange
     const newState = {isLoading: true};

     // Act
     underTest.patchState(newState);

     // Assert
     expect(underTest['state'].getValue()).toEqual({...initialState, ...newState});
   });
 });
