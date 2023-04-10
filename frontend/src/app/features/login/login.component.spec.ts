import {ComponentFixture, TestBed, fakeAsync, tick, waitForAsync} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {UserService} from './services/user.service';
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {Provider} from "@angular/core";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(waitForAsync(() => {
    userServiceSpy = jasmine.createSpyObj<UserService>(['loginUser']);
    TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        BrowserAnimationsModule
      ],
    }).overrideComponent(LoginComponent, {
      remove: {
        providers: [UserService]
      },
      add: {
        providers: [
          {provide: UserService, useValue: userServiceSpy}
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
});
