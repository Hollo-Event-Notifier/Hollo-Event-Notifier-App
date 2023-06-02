import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {UsersService} from './users.service';
import {
  CreateUserRequestDto,
  UserCredentialsDto,
  UserDto,
  UserDtoRoleEnum,
  UsersApiService,
  UsersApiServiceInterface
} from '../api';
import {ApplicationStateService} from './application-state.service';
import {SnackbarService} from './snackbar.service';
import {Router} from '@angular/router';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../models/user';
import Spy = jasmine.Spy;

describe('UsersService', () => {
  let service: UsersService;
  let usersApiServiceSpy: jasmine.SpyObj<UsersApiServiceInterface>;
  let applicationStateServiceSpy: jasmine.SpyObj<ApplicationStateService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const currentUserStub: User = {
    userType: 'current',
    username: 'test username',
    email: 'test email',
    role: UserDtoRoleEnum.EventAdmin
  }

  beforeEach(() => {
    usersApiServiceSpy = jasmine.createSpyObj('UsersApiService', ['login', 'getAllUsers', 'createUser', 'updateUser', 'deleteUserById']);
    applicationStateServiceSpy = jasmine.createSpyObj('ApplicationStateService', ['patchState'], {currentUser$: of(currentUserStub)});
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        {provide: UsersApiService, useValue: usersApiServiceSpy},
        {provide: ApplicationStateService, useValue: applicationStateServiceSpy},
        {provide: SnackbarService, useValue: snackbarServiceSpy},
        {provide: Router, useValue: routerSpy}
      ]
    });

    service = TestBed.inject(UsersService);

  });

  it('should login user and navigate to admin on successful login', fakeAsync(() => {
    // Arrange
    const credentials: UserCredentialsDto = {username: 'testuser', password: 'testpassword'};
    const currentUser: UserDto = {id: '1', username: 'Test User'} as UserDto;
    usersApiServiceSpy.login.and.returnValue(of(currentUser));
    routerSpy.navigate.and.returnValue(jasmine.createSpyObj<Promise<boolean>>(['then']));

    // Act
    service.loginUser(credentials);
    tick();

    // Assert
    expect(applicationStateServiceSpy.patchState).toHaveBeenCalledWith({...currentUser, userType: 'current'});
    expect(routerSpy.navigate).toHaveBeenCalledWith(['admin']);
  }));

  it('should display snackbar error on login error', fakeAsync(() => {
    // Arrange
    const credentials: UserCredentialsDto = {username: 'testuser', password: 'testpassword'};
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({error: 'Login failed'});
    usersApiServiceSpy.login.and.returnValue(throwError(errorResponse));

    // Act
    service.loginUser(credentials);
    tick();

    // Assert
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith(errorResponse.error);
  }));

  it('should retrieve all users and update application state', () => {
    // Arrange
    const users: UserDto[] = [
      {id: '1', username: 'User 1'} as UserDto,
      {id: '2', username: 'User 2'} as UserDto
    ];
    const currentUser: User = {id: '3', username: 'Current User'} as User;
    (Object.getOwnPropertyDescriptor(applicationStateServiceSpy, 'currentUser$')
      ?.get as Spy<() => Observable<User>>).and.returnValue(of(currentUser));
    usersApiServiceSpy.getAllUsers.and.returnValue(of(users));

    // Act
    service.getAllUsers();

    // Assert
    expect(applicationStateServiceSpy.patchState).toHaveBeenCalledWith({
      users: users
        .filter(user => user.id !== currentUser.id)
        .map<User>(user => ({...user, userType: 'other'}))
    });
  });

  it('should create a new user and update application state', () => {
    // Arrange
    const userToBeCreated: CreateUserRequestDto = {username: 'New User'} as CreateUserRequestDto;
    const createdUser: UserDto = {id: '1', username: 'New User'} as UserDto;
    usersApiServiceSpy.createUser.and.returnValue(of(createdUser));

    // Act
    service.createUser(userToBeCreated);

    // Assert
    expect(applicationStateServiceSpy.patchState).toHaveBeenCalledWith({...createdUser, userType: 'other'});
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith('User created successfully!');
  });

  it('should update a user and update application state', () => {
    // Arrange
    const userToUpdate: User = {id: '1', username: 'Updated User', userType: 'other'} as User;
    const updatedUser: UserDto = {id: '1', username: 'Updated User'} as UserDto;
    usersApiServiceSpy.updateUser.and.returnValue(of(updatedUser));

    // Act
    service.updateUser(userToUpdate);

    // Assert
    expect(applicationStateServiceSpy.patchState).toHaveBeenCalledWith({
      ...updatedUser,
      userType: userToUpdate.userType
    });
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith('User updated successfully!');
  });

  it('should delete a user and update application state', () => {
    // Arrange
    const userId = '1';
    usersApiServiceSpy.deleteUserById.and.returnValue(of(EMPTY));

    // Act
    service.deleteUser(userId);

    // Assert
    expect(applicationStateServiceSpy.patchState).toHaveBeenCalledWith(userId);
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith('User deleted successfully!');
  });
});
