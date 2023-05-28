import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserDto, UserDtoRoleEnum} from "../../../../core/api";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserEditorForm} from "../../models/user-editor-form";
import {User} from "../../../../core/models/user";

@Component({
  selector: 'app-user-editor-dialog',
  templateUrl: './user-editor-dialog.component.html',
  styleUrls: ['./user-editor-dialog.component.scss']
})
export class UserEditorDialogComponent {
  readonly roles: string[] = Object.values(UserDtoRoleEnum);
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

  constructor(
    private readonly dialogRef: MatDialogRef<UserEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: User,
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
      userType: this.data.userType,
      id: this.data.id
    } as User);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
