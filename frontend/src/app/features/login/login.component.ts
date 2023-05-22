import {Component} from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginForm} from "./models/login-form";
import {UsersService} from "../../core/services/users.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class LoginComponent {
  showPassword: boolean = false;
  formGroup: FormGroup<LoginForm> = new FormGroup<LoginForm>({
    username: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
    password: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    })
  });

  constructor(private readonly usersService: UsersService) {
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.usersService.loginUser({
      ...this.formGroup.getRawValue()
    });
  }
}
