import {Component} from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginForm} from "./models/login-form";
import {UserService} from "./services/user.service";
import {TranslocoModule, TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedModule, TranslocoModule],
  providers: [UserService]
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

  constructor(
    private readonly userService: UserService,
    private translocoService: TranslocoService) {
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  switchLanguage(language : string) {
    this.translocoService.setActiveLang(language);
  }

  login(): void {
    this.userService.loginUser({
      ...this.formGroup.getRawValue()
    });
  }
}
