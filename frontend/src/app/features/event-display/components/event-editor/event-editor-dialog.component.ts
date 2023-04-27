import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EventInput} from "@fullcalendar/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EventMapperService} from "../../services/event-mapper.service";

interface EventForm {
  title: FormControl<string>;
  place: FormControl<string>;
  organizer: FormControl<string>;
  hasPoints: FormControl<boolean>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
}

@Component({
  selector: 'app-components',
  templateUrl: './event-editor-dialog.component.html',
  styleUrls: ['./event-editor-dialog.component.scss']
})
export class EventEditorDialogComponent {
  formGroup = new FormGroup<EventForm>({
    title: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
    place: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
    organizer: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
    hasPoints: new FormControl<boolean>(false, {
      validators: Validators.required,
      nonNullable: true
    }),
    startDate: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
    endDate: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<EventEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: EventInput,
    private readonly eventMapperService: EventMapperService
  ) {
    const mappedEvent = this.eventMapperService.mapEventInputToEventDto(data);
    this.formGroup.setValue({
      title: mappedEvent.title,
      place: mappedEvent.place,
      organizer: mappedEvent.organizer,
      hasPoints: mappedEvent.hasPoints,
      startDate: mappedEvent.startDate,
      endDate: mappedEvent.endDate,
    });
  }

  onSave() {
    this.dialogRef.close(this.formGroup.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}

