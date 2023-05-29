import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {EventDto} from '../../../../core/api';
import {EventEditorData} from '../../models/event-editor-data';
import {EditorMode} from '../../enums/editor-mode';
import {EventEditorDialogComponent} from './event-editor-dialog.component';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {getTranslocoModule} from "../../../../core/utils/transloco-testing.factory";

describe('EventEditorDialogComponent', () => {
  let component: EventEditorDialogComponent;
  let fixture: ComponentFixture<EventEditorDialogComponent>;

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
    mode: EditorMode.Create
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventEditorDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        getTranslocoModule()
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
    fixture = TestBed.createComponent(EventEditorDialogComponent);
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
    component.onSave();

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
