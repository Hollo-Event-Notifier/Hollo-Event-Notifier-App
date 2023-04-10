import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import {UserApiService, UserApiServiceInterface} from '../api';
import { of } from 'rxjs';

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let userApiServiceSpy: jasmine.SpyObj<UserApiServiceInterface>;

  beforeEach(() => {
    userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['checkToken']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when user is authenticated', fakeAsync(() => {
    // Arrange
    userApiServiceSpy.checkToken.and.returnValue(of(true));

    // Act
    let result: boolean | undefined;
    service.canActivate().subscribe(res => result = res);
    tick();

    // Assert
    expect(result).toBeTrue();
    expect(userApiServiceSpy.checkToken).toHaveBeenCalled();
  }));

  it('should return false when user is not authenticated', fakeAsync(() => {
    // Arrange
    userApiServiceSpy.checkToken.and.returnValue(of(false));

    // Act
    let result: boolean | undefined;
    service.canActivate().subscribe(res => result = res);
    tick();

    // Assert
    expect(result).toBeFalse();
    expect(userApiServiceSpy.checkToken).toHaveBeenCalled();
  }));
});
