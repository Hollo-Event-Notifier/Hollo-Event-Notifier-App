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
      // the pattern ensures the followings in the password string
      // - the string contains at least one lowercase letter
      // - the string contains at least one uppercase letter
      // - the string contains at least one digit
      // - the string is at least 8 letter long
      validators: [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)],
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
