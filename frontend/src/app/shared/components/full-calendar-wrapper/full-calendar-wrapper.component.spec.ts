import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {FullCalendarWrapperComponent} from './full-calendar-wrapper.component';
import {EventMapperService} from "../../../core/services/event-mapper.service";
import {SharedModule} from "../../shared.module";
import {EventDto} from "../../../core/api";
import {CalendarApi, DateSelectArg, EventChangeArg, EventClickArg, ViewApi} from "@fullcalendar/core";
import {Provider} from "@angular/core";

describe('FullCalendarWrapperComponent', () => {
  let component: FullCalendarWrapperComponent;
  let fixture: ComponentFixture<FullCalendarWrapperComponent>;
  let eventMapperServiceSpy: jasmine.SpyObj<EventMapperService>;

  beforeEach(waitForAsync(() => {
    eventMapperServiceSpy = jasmine.createSpyObj<EventMapperService>(['mapCalendarEventToEventDto'])
    TestBed.configureTestingModule({
      declarations: [FullCalendarWrapperComponent],
      providers: [
        {provide: EventMapperService, useValue: eventMapperServiceSpy}
      ] as Provider[],
      imports: [SharedModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullCalendarWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set calendar options correctly in ngOnInit', () => {
    // Arrange
    const hasWeekends = true;
    const isEditable = true;
    const isSelectable = true;
    component.hasWeekends = hasWeekends;
    component.isEditable = isEditable;
    component.isSelectable = isSelectable;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.calendarOptions.weekends).toBe(hasWeekends);
    expect(component.calendarOptions.editable).toBe(isEditable);
    expect(component.calendarOptions.selectable).toBe(isSelectable);
  });

  it('should emit dateSelect event when handleDateSelect is called', () => {
    // Arrange
    const calendarSpy = jasmine.createSpyObj<CalendarApi>(['unselect']);

    const dateSelectArg: DateSelectArg = {
      start: new Date(),
      end: new Date(),
      view: {
        calendar: calendarSpy as CalendarApi,
      } as ViewApi,
    } as DateSelectArg;

    const expectedEventDto: EventDto = {
      hasPoints: false,
      organizer: '',
      place: '',
      title: '',
      startDate: dateSelectArg.start.toISOString(),
      endDate: dateSelectArg.end.toISOString(),
      link: ''
    };
    spyOn(component.dateSelectEmitter, 'emit');

    // Act
    // Only ignored because method passed into calendarOptions
    // @ts-ignore
    component.handleDateSelect(dateSelectArg);

    // Assert
    expect(component.dateSelectEmitter.emit).toHaveBeenCalledWith(expectedEventDto);
    expect(calendarSpy.unselect).toHaveBeenCalledTimes(1);
  });

  it('should emit eventClick event when handleEventClick is called', () => {
    // Arrange
    const clickInfo: EventClickArg = {} as EventClickArg;
    const eventDto: EventDto = {
      hasPoints: false,
      organizer: 'Test organizer',
      place: 'Test place',
      title: 'Test Event',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString()
    };
    spyOn(component.eventClickEmitter, 'emit');
    eventMapperServiceSpy.mapCalendarEventToEventDto.and.returnValue(eventDto);

    // Act
    // Only ignored because method passed into calendarOptions
    // @ts-ignore
    component.handleEventClick(clickInfo);

    // Assert
    expect(component.eventClickEmitter.emit).toHaveBeenCalledWith(eventDto);
  });

  it('should emit eventChange event when handleEventChange is called', () => {
    const changeInfo: EventChangeArg = {} as EventChangeArg;
    const eventDto: EventDto = {
      hasPoints: false,
      organizer: 'Test organizer',
      place: 'Test place',
      title: 'Test Event',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString()
    };
    spyOn(component.eventChangeEmitter, 'emit');
    eventMapperServiceSpy.mapCalendarEventToEventDto.and.returnValue(eventDto);

    // Act
    // Only ignored because method passed into calendarOptions
    // @ts-ignore
    // Act
    component.handleEventChange(changeInfo);

    // Assert
    expect(component.eventChangeEmitter.emit).toHaveBeenCalledWith(eventDto);
  });
});
