import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SharedModule} from '../../../../shared/shared.module';
import {EventDto} from '../../../../core/api';
import {EventDisplayDialogComponent} from './event-display-dialog.component';
import {getTranslocoModule} from "../../../../core/utils/transloco-testing.factory";

describe('EventDisplayDialogComponent', () => {
  let component: EventDisplayDialogComponent;
  let fixture: ComponentFixture<EventDisplayDialogComponent>;
  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(waitForAsync(() => {
    // Arrange: set up the TestBed environment
    TestBed.configureTestingModule({
      imports: [
        EventDisplayDialogComponent,
        SharedModule,
        getTranslocoModule()
      ],
    }).overrideComponent(EventDisplayDialogComponent, {
      add: {
        providers: [
          {provide: MatDialogRef, useValue: dialogRefSpy},
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              // Set the properties of the mock event data here
            } as EventDto,
          },
        ],
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    // Arrange: create the component fixture and instance
    fixture = TestBed.createComponent(EventDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should call `close` method when `onClose` is called', () => {
    // Act
    component.onClose();

    // Assert
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
