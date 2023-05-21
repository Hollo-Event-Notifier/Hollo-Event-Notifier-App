import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserDto, UserDtoRoleEnum} from "../../../../core/api";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserEditorForm} from "../../models/user-editor-form";

@Component({
  selector: 'app-user-editor-dialog',
  templateUrl: './user-editor-dialog.component.html',
  styleUrls: ['./user-editor-dialog.component.scss']
})
export class UserEditorDialogComponent {
  formGroup: FormGroup<UserEditorForm> = new FormGroup<UserEditorForm>({
    username: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    role: new FormControl<UserDtoRoleEnum>(UserDtoRoleEnum.EventAdmin, {
      validators: Validators.required,
      nonNullable: true
    }),
  });
  readonly roles: string[] = Object.values(UserDtoRoleEnum);

  constructor(
    private readonly dialogRef: MatDialogRef<UserEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: UserDto,
  ) {
    this.formGroup.setValue({
      email: data.email,
      role: data.role,
      username: data.username
    });
  }
  onSave() {
    this.dialogRef.close({
      ...this.formGroup.value,
      id: this.data.id
    } as UserDto);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
