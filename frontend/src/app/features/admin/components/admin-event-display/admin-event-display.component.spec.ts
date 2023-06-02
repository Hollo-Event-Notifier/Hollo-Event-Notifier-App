import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AdminEventDisplayComponent} from './admin-event-display.component';
import {ApplicationStateService} from "../../../../core/services/application-state.service";
import {EventsService} from "../../../../core/services/events.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NO_ERRORS_SCHEMA, Provider} from "@angular/core";
import {EventDto} from "../../../../core/api";
import {EventEditorDialogComponent} from "../event-editor-dialog/event-editor-dialog.component";
import {EditorMode} from "../../enums/editor-mode";
import {EventEditorData} from "../../models/event-editor-data";
import {of} from "rxjs";

describe('AdminEventDisplayComponent', () => {
  let component: AdminEventDisplayComponent;
  let fixture: ComponentFixture<AdminEventDisplayComponent>;

  let stateSpy: jasmine.SpyObj<ApplicationStateService>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(waitForAsync(() => {
    stateSpy = jasmine.createSpyObj<ApplicationStateService>([], ['events$'])
    eventsServiceSpy = jasmine.createSpyObj<EventsService>(['getEvents', 'createEvent', 'updateEvent', 'deleteEvent'])
    matDialogSpy = jasmine.createSpyObj<MatDialog>(['open'])

    TestBed.configureTestingModule({
      declarations: [AdminEventDisplayComponent],
      providers: [
        {provide: ApplicationStateService, useValue: stateSpy},
        {provide: EventsService, useValue: eventsServiceSpy},
        {provide: MatDialog, useValue: matDialogSpy},
      ] as Provider[],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEventDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should open create dialog correctly and create event', () => {
    // Arrange
    const emptyEventWithDates: EventDto = {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString()
    } as EventDto;

    const createdEvent: EventDto = {
      startDate: emptyEventWithDates.startDate,
      endDate: emptyEventWithDates.endDate,
      title: 'Test title',
      place: 'Test place',
      organizer: 'Test organizer',
      hasPoints: false
    }

    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<EventEditorDialogComponent>>(['afterClosed']);

    matDialogSpy.open.and.returnValue(matDialogRefSpy);
    matDialogRefSpy.afterClosed.and.returnValue(of(createdEvent));

    // Act
    component.onDateSelect(emptyEventWithDates);

    // Assert
    expect(matDialogSpy.open).toHaveBeenCalledOnceWith(EventEditorDialogComponent, {
      data: {
        event: emptyEventWithDates,
        mode: EditorMode.Create
      } as EventEditorData
    });
    expect(eventsServiceSpy.createEvent).toHaveBeenCalledOnceWith(createdEvent);
  });

  it('should update event when onEventChange is called', () => {
    // Arrange
    const eventToUpdate: EventDto = {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      hasPoints: false,
      organizer: 'Test organizer',
      place: 'Test place',
      title: 'Test title',
    }

    // Act
    component.onEventChange(eventToUpdate)

    // Assert
    expect(eventsServiceSpy.updateEvent).toHaveBeenCalledOnceWith(eventToUpdate);
  });

  it('should open update event dialog and update event when value is EventDto', () => {
    // Arrange
    const eventToUpdate: EventDto = {
      title: 'Test Event',
      startDate: '2022-01-01',
      endDate: '2022-01-02',
      place: 'Test place',
      organizer: 'Test organizer',
      hasPoints: false
    };
    const updatedEvent: EventDto = {...eventToUpdate, title: 'Updated Event'};

    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<EventEditorDialogComponent>>(['afterClosed']);

    matDialogRefSpy.afterClosed.and.returnValue(of(updatedEvent));
    matDialogSpy.open.and.returnValue(matDialogRefSpy);

    // Act
    component.onEventClick(eventToUpdate);

    // Assert
    expect(matDialogSpy.open).toHaveBeenCalledWith(EventEditorDialogComponent, {
      data: {
        event: eventToUpdate,
        mode: EditorMode.Update
      } as EventEditorData
    });
    expect(eventsServiceSpy.updateEvent).toHaveBeenCalledWith(updatedEvent);
    expect(eventsServiceSpy.deleteEvent).not.toHaveBeenCalled();
  });

  it('should open update event dialog and delete event when value is string', () => {
    // Arrange
    const eventToUpdate: EventDto = {
      title: 'Test Event',
      startDate: '2022-01-01',
      endDate: '2022-01-02',
      place: 'Test place',
      organizer: 'Test organizer',
      hasPoints: false
    };
    const eventId = '1';

    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<EventEditorDialogComponent>>(['afterClosed']);

    matDialogRefSpy.afterClosed.and.returnValue(of(eventId));
    matDialogSpy.open.and.returnValue(matDialogRefSpy);

    // Act
    component.onEventClick(eventToUpdate);

    // Assert
    expect(matDialogSpy.open).toHaveBeenCalledWith(EventEditorDialogComponent, {
      data: {
        event: eventToUpdate,
        mode: EditorMode.Update
      } as EventEditorData
    });
    expect(eventsServiceSpy.deleteEvent).toHaveBeenCalledWith(eventId);
    expect(eventsServiceSpy.updateEvent).not.toHaveBeenCalled();
  });

  it('should open dialog with default event when fab is clicked', () => {
    // Arrange
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    const expectedEvent: EventDto = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      hasPoints: false,
      organizer: '',
      place: '',
      title: ''
    };

    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<EventEditorDialogComponent>>(['afterClosed']);
    matDialogRefSpy.afterClosed.and.returnValue(of(undefined));

    matDialogSpy.open.and.returnValue(matDialogRefSpy);

    // Act
    component.onFabClick();

    expect(matDialogSpy.open).toHaveBeenCalledWith(EventEditorDialogComponent, {
      data: {
        event: expectedEvent,
        mode: EditorMode.Create
      } as EventEditorData
    });
    expect(eventsServiceSpy.createEvent).not.toHaveBeenCalled();
  });

  it('should create event when dialog is closed with valid event', () => {
    // Arrange
    const expectedEvent: EventDto = {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      hasPoints: false,
      organizer: '',
      place: '',
      title: ''
    };

    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<EventEditorDialogComponent>>(['afterClosed']);

    matDialogRefSpy.afterClosed.and.returnValue(of(expectedEvent));
    matDialogSpy.open.and.returnValue(matDialogRefSpy);

    // Act
    component.onFabClick();

    // Assert
    expect(eventsServiceSpy.createEvent).toHaveBeenCalledWith(expectedEvent);
  });

  it('should not create event when dialog is closed with invalid event', () => {
    // Arrange
    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<EventEditorDialogComponent>>(['afterClosed']);

    matDialogRefSpy.afterClosed.and.returnValue(of({prop: 'invalid value'}));
    matDialogSpy.open.and.returnValue(matDialogRefSpy);

    // Act
    component.onFabClick();


    // Assert
    expect(eventsServiceSpy.createEvent).not.toHaveBeenCalled();
  });
});
