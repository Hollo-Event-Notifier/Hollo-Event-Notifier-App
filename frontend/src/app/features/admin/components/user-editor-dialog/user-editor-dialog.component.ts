import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserDtoRoleEnum} from "../../../../core/api";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserEditorForm} from "../../models/user-editor-form";
import {User} from "../../../../core/models/user";
import {UserEditorData} from "../../models/user-editor-data";

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
    @Inject(MAT_DIALOG_DATA) readonly data: UserEditorData,
  ) {
    this.formGroup.setValue({
      email: data.user.email,
      role: data.user.role,
      username: data.user.username
    });
  }
  onSave() {
    this.dialogRef.close({
      ...this.formGroup.value,
      userType: this.data.user.userType,
      id: this.data.user.id
    } as User);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
