import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslationService} from "../../../../core/services/translation.service";
import {RegistrationForm} from "../../models/registration-form";
import {Router} from "@angular/router";
import {AppRoutes} from "../../../../app-routes";
import {UsersApiService} from "../../../../core/api";
import {SnackbarService} from "../../../../core/services/snackbar.service";
import {RegistrationRoutes} from "../../enums/registration-routes";

@Component({
  selector: 'app-registration',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent {
  showPassword: boolean = false;
  currentLanguage: string;

  formGroup: FormGroup<RegistrationForm> = new FormGroup<RegistrationForm>({
    username: new FormControl<string>('', {
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
    })
  });

  constructor(
    private readonly translationService: TranslationService,
    private readonly router: Router,
    private readonly usersApiService: UsersApiService,
    private readonly snackbarService: SnackbarService
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

  register() {
    this.usersApiService.registerUser(this.formGroup.getRawValue()).subscribe({
      next: () => this.router.navigate([AppRoutes.Registration, RegistrationRoutes.Success]),
      error: () => this.snackbarService.open('User registration was not successful!')
    });
  }

  navigateToLogin() {
    this.router.navigate([AppRoutes.Login])
  }
}
