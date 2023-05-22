import {Component} from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginForm} from "./models/login-form";
import {UserService} from "./services/user.service";
import {TranslationService} from "../../core/services/translation.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedModule],
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
  currentLanguage : string;
  constructor(
    private readonly userService: UserService,
    private readonly translationService: TranslationService) {
    this.currentLanguage = this.translationService.currentLanguage;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  changeLanguage(): void {
    this.translationService.changeLanguage();
    this.currentLanguage = this.translationService.currentLanguage;
  }

  login(): void {
    this.userService.loginUser({
      ...this.formGroup.getRawValue()
    });
  }
}
