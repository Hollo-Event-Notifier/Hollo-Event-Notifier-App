import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {EventDto} from '../../../../core/api';
import {EventEditorData} from '../../models/event-display-data';
import {EventEditorMode} from '../../enums/event-display-mode';
import {EventDisplayDialogComponent} from './event-display-dialog.component';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('EventEditorDialogComponent', () => {
  let component: EventDisplayDialogComponent;
  let fixture: ComponentFixture<EventDisplayDialogComponent>;

  const eventEditorDataMock: EventEditorData = {
    event: {
      id: '123',
      title: 'Test Title',
      place: 'Test Place',
      organizer: 'Test Organizer',
      hasPoints: true,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      link: 'https://example.com',
    },
    mode: EventEditorMode.Create
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventDisplayDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: MatDialogRef, useValue: {
            close: jasmine.createSpy('close')
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: eventEditorDataMock}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group with values from input data', () => {
    // Arrange
    const expectedFormValues: EventDto = {
      title: eventEditorDataMock.event.title,
      place: eventEditorDataMock.event.place,
      organizer: eventEditorDataMock.event.organizer,
      hasPoints: eventEditorDataMock.event.hasPoints,
      startDate: eventEditorDataMock.event.startDate,
      endDate: eventEditorDataMock.event.endDate,
      link: eventEditorDataMock.event.link
    };

    // Act

    // Assert
    expect(component.formGroup.value).toEqual(expectedFormValues);
  });

  it('should emit updated event data on save', () => {
    // Arrange
    const expectedEventDto = {
      id: '123',
      title: 'New Title',
      place: 'New Place',
      organizer: 'New Organizer',
      hasPoints: false,
      startDate: eventEditorDataMock.event.startDate,
      endDate: eventEditorDataMock.event.endDate,
      link: eventEditorDataMock.event.link
    } as EventDto;

    // Act
    component.formGroup.patchValue({
      title: 'New Title',
      place: 'New Place',
      organizer: 'New Organizer',
      hasPoints: false
    });
    component.onClose();

    // Assert
    expect(component['dialogRef'].close).toHaveBeenCalledWith(expectedEventDto);
  });

  it('should emit event id on delete', () => {
    // Arrange: done in beforeEach

    // Act
    component.onDelete();

    // Assert
    expect(component['dialogRef'].close).toHaveBeenCalledWith('123');
  });

  it('should close dialog on cancel', () => {
    // Arrange: done in beforeEach

    // Act
    component.onCancel();

    // Assert
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });
});
