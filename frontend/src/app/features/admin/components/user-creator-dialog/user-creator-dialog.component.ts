import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserCreatorForm} from "../../models/user-creator-form";
import {CreateUserRequestDtoRoleEnum} from "../../../../core/api";

@Component({
  selector: 'app-user-creator-dialog',
  templateUrl: './user-creator-dialog.component.html',
  styleUrls: ['./user-creator-dialog.component.scss']
})
export class UserCreatorDialogComponent {
  formGroup: FormGroup<UserCreatorForm> = new FormGroup<UserCreatorForm>({
    username: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
    role: new FormControl<CreateUserRequestDtoRoleEnum>(CreateUserRequestDtoRoleEnum.EventAdmin, {
      validators: Validators.required,
      nonNullable: true
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    password: new FormControl<string>('', {
      validators: Validators.required, // TODO add complexity validator for password
      nonNullable: true
    }),
  })
  readonly roles: string[] = Object.values(CreateUserRequestDtoRoleEnum);
  showPassword: boolean = false;

  constructor(
    private readonly dialogRef: MatDialogRef<UserCreatorDialogComponent>,
  ) {
  }

  onSave() {
    this.dialogRef.close({...this.formGroup.value});
  }

  onCancel() {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
