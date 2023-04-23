import {UserService} from "./user.service";
import {Subject} from "rxjs";
import {UserCredentialsDto, UsersApiService, UsersApiServiceInterface} from "../../../core/api";
import {SnackbarService} from "../../../core/services/snackbar.service";
import {Router} from "@angular/router";
import {TestBed} from "@angular/core/testing";
import {Provider} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {AppRoutes} from "../../../app-routes";

describe('UserService', () => {
  let underTest: UserService;
  let responseMock: Subject<string>;
  let userApiMock: Partial<UsersApiServiceInterface> = {
    login: () => responseMock.asObservable(),
  };
  let snackBarSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const userCredentialsStub: UserCredentialsDto = {
    username: 'username',
    password: 'password'
  }

  beforeEach(() => {
    responseMock = new Subject<string>();
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        {provide: UsersApiService, useValue: userApiMock},
        {provide: SnackbarService, useValue: snackBarSpy},
        {provide: Router, useValue: routerSpy},
        UserService
      ] as Provider[]
    });
    underTest = TestBed.inject(UserService);
  });

  it('should be created', () => {
    // arrange

    // act

    // assert
    expect(underTest).toBeTruthy();
    expect(underTest['userApi']).toBe(userApiMock as UsersApiService);
    expect(underTest['snackBar']).toBe(snackBarSpy);
    expect(underTest['router']).toBe(routerSpy);
  });

  it('should login user', () => {
    // arrange
    const token = 'token';
    const promiseSpy = jasmine.createSpyObj('Promise', ['then']);
    routerSpy.navigate.and.returnValue(promiseSpy);

    // act
    underTest.loginUser(userCredentialsStub);
    responseMock.next(token);

    // assert
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith([AppRoutes.Admin]);
    expect(promiseSpy.then).toHaveBeenCalledTimes(1);
  });

  it('shouldn\'t login user', () => {
    // arrange
    const errorResponseMock: Partial<HttpErrorResponse> = {
      error: 'error'
    };

    // act
    underTest.loginUser(userCredentialsStub);
    responseMock.error(errorResponseMock);

    // assert
    expect(snackBarSpy.open).toHaveBeenCalledOnceWith(errorResponseMock.error);
  });
});
