import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Provider} from "@angular/core";
import {UsersService} from "../../core/services/users.service";
import {TranslationService} from "../../core/services/translation.service";
import {ApplicationStateService} from "../../core/services/application-state.service";
import {getTranslocoModule} from "../../core/utils/transloco-testing.factory";
import {Language} from "../../core/models/language";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let translationServiceSpy: jasmine.SpyObj<TranslationService>;
  let stateSpy: jasmine.SpyObj<ApplicationStateService>;

  beforeEach(waitForAsync(() => {
    userServiceSpy = jasmine.createSpyObj<UsersService>(['loginUser']);
    translationServiceSpy = jasmine.createSpyObj<TranslationService>(['changeLanguage'],
      {currentLanguage: Language.En});
    stateSpy = jasmine.createSpyObj<ApplicationStateService>(['patchState']);
    TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        BrowserAnimationsModule,
        getTranslocoModule()
      ],
    }).overrideComponent(LoginComponent, {
      remove: {
        providers: [UsersService]
      },
      add: {
        providers: [
          {provide: UsersService, useValue: userServiceSpy},
          {provide: TranslationService, useValue: translationServiceSpy},
          {provide: ApplicationStateService, useValue: stateSpy},
        ] as Provider[]
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    // arrange
    expect(component.showPassword).toBeFalse();

    // act
    component.togglePasswordVisibility();

    // assert
    expect(component.showPassword).toBeTrue();
  });

  it('should call UserService.loginUser() with correct parameters when login() is called', () => {
    // arrange
    const username = 'testuser';
    const password = 'testpassword';
    component.formGroup.patchValue({username, password});
    userServiceSpy.loginUser.and.stub();


    // act
    component.login();

    // assert
    expect(userServiceSpy.loginUser).toHaveBeenCalledOnceWith({username, password});
  });

  it('should call TranslationService.changeLanguage when changeLanguage is called', () => {
    // Arrange

    // Act
    component.changeLanguage();

    // Assert
    expect(translationServiceSpy.changeLanguage).toHaveBeenCalled();
  });

  it('should update currentLanguage when changeLanguage is called', () => {
    // Arrange


    // Act
    component.changeLanguage();

    // Assert
    expect(component.currentLanguage).toEqual(Language.En);
  });
});
