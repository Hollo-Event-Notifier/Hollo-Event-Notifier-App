import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EventDto} from "../../../../core/api";
import {EventEditorData} from "../../models/event-editor-data";
import {EventEditorForm} from "../../models/event-editor-form";
import {EditorMode} from "../../enums/editor-mode";

@Component({
  selector: 'app-components',
  templateUrl: './event-editor-dialog.component.html',
  styleUrls: ['./event-editor-dialog.component.scss']
})
export class EventEditorDialogComponent {
  formGroup = new FormGroup<EventEditorForm>({
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
    link: new FormControl<string>('', {
      validators: Validators.pattern(/^(http|https):\/\/[a-z0-9]+([\-.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
      nonNullable: true,
    }),
  });
  editorMode: typeof EditorMode = EditorMode;

  constructor(
    private readonly dialogRef: MatDialogRef<EventEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: EventEditorData,
  ) {
    this.formGroup.setValue({
      title: data.event.title,
      place: data.event.place,
      organizer: data.event.organizer,
      hasPoints: data.event.hasPoints,
      startDate: data.event.startDate,
      endDate: data.event.endDate,
      link: data.event.link!! ? data.event.link : '',
    });
  }

  onSave() {
    this.dialogRef.close({
      ...this.formGroup.value,
      id: this.data.event.id,
      link: this.formGroup.value.link !== '' ? this.formGroup.value.link : undefined
    } as EventDto);
  }

  onDelete() {
    this.dialogRef.close(this.data.event.id);
  }

  onCancel() {
    this.dialogRef.close();
  }
}

