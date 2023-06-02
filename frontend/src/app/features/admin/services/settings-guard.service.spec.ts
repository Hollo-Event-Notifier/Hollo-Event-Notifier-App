import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {SnackbarService} from '../../../core/services/snackbar.service';
import {ApplicationStateService} from '../../../core/services/application-state.service';
import {UserDtoRoleEnum} from '../../../core/api';
import {User} from '../../../core/models/user';
import {SettingsGuardService} from './settings-guard.service';
import {AppRoutes} from '../../../app-routes';
import {of} from "rxjs";

describe('SettingsGuardService', () => {
  let settingsGuardService: SettingsGuardService;
  let applicationStateService: jasmine.SpyObj<ApplicationStateService>;
  let router: jasmine.SpyObj<Router>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;

  const currentUserStub: User = {
    userType: 'current',
    username: 'test username',
    email: 'test email',
    role: UserDtoRoleEnum.EventAdmin
  };

  beforeEach(() => {
    const applicationStateSpy = jasmine.createSpyObj('ApplicationStateService', [],
      {currentUser$: of(currentUserStub)});
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackbarSpy = jasmine.createSpyObj('SnackbarService', ['open']);

    TestBed.configureTestingModule({
      providers: [
        SettingsGuardService,
        { provide: ApplicationStateService, useValue: applicationStateSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackbarService, useValue: snackbarSpy }
      ]
    });

    settingsGuardService = TestBed.inject(SettingsGuardService);
    applicationStateService = TestBed.inject(ApplicationStateService) as jasmine.SpyObj<ApplicationStateService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackbarService = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
  });

  it('should be created', () => {
    // Arrange

    // Act

    // Assert
    expect(settingsGuardService).toBeTruthy();
  });

  it('should navigate to EventDisplay and display a snackbar message when canActivate returns false', () => {
    // Arrange
    currentUserStub.role = UserDtoRoleEnum.EventAdmin;
    router.navigate.and.returnValue(jasmine.createSpyObj<Promise<boolean>>(['then']));

    // Act
    const canActivate = settingsGuardService.canActivate();

    // Assert
    expect(canActivate).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([AppRoutes.EventDisplay]);
    expect(snackbarService.open).toHaveBeenCalledWith("You can't access this route!");
  });

  it('should return true when canActivate returns true', () => {
    // Arrange
    currentUserStub.role = UserDtoRoleEnum.SystemAdmin;

    // Act
    const canActivate = settingsGuardService.canActivate();

    // Assert
    expect(canActivate).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(snackbarService.open).not.toHaveBeenCalled();
  });
});
