import {Component} from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginForm} from "./models/login-form";
import {TranslationService} from "../../core/services/translation.service";
import {UsersService} from "../../core/services/users.service";
import {Router, RouterLink} from "@angular/router";
import {AppRoutes} from "../../app-routes";

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
  currentLanguage: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly translationService: TranslationService,
    private readonly router: Router
  ) {
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
    this.usersService.loginUser({
      ...this.formGroup.getRawValue()
    });
  }

  protected readonly AppRoutes = AppRoutes;

  navigateToRegister() {
    this.router.navigate([AppRoutes.Registration])
  }
}
