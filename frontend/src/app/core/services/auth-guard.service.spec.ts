import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { of } from 'rxjs';
import {UsersApiService, UsersApiServiceInterface} from "../api";

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let userApiServiceSpy: jasmine.SpyObj<UsersApiServiceInterface>;

  beforeEach(() => {
    userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['checkToken']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: UsersApiService, useValue: userApiServiceSpy }
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
