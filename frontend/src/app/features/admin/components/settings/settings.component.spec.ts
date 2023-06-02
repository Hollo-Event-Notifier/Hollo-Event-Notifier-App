import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { ApplicationStateService } from '../../../../core/services/application-state.service';
import { UsersService } from '../../../../core/services/users.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UserDeleteDialogComponent } from '../user-delete-dialog/user-delete-dialog.component';
import { UserEditorDialogComponent } from '../user-editor-dialog/user-editor-dialog.component';
import { UserCreatorDialogComponent } from '../user-creator-dialog/user-creator-dialog.component';
import { UserEditorData } from '../../models/user-editor-data';
import {CreateUserRequestDto, UserDto} from '../../../../core/api';
import {getTranslocoModule} from "../../../../core/utils/transloco-testing.factory";
import {of} from "rxjs";

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let stateService: jasmine.SpyObj<ApplicationStateService>;
  let usersService: jasmine.SpyObj<UsersService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const stateSpy = jasmine.createSpyObj('ApplicationStateService', ['getAllUsers']);
    const usersSpy = jasmine.createSpyObj('UsersService', ['deleteUser', 'updateUser', 'createUser', 'getAllUsers']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        { provide: ApplicationStateService, useValue: stateSpy },
        { provide: UsersService, useValue: usersSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      imports: [
        getTranslocoModule()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(ApplicationStateService) as jasmine.SpyObj<ApplicationStateService>;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should call ApplicationStateService.getAllUsers on ngOnInit', () => {
    // Arrange

    // Act
    fixture.detectChanges();

    // Assert
    expect(usersService.getAllUsers).toHaveBeenCalled();
  });

  it('should call UsersService.deleteUser when openDeleteDialog is called with a userId', () => {
    // Arrange
    const userId = '123';

    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<UserDeleteDialogComponent>>(['afterClosed']);

    matDialog.open.and.returnValue(matDialogRefSpy);
    matDialogRefSpy.afterClosed.and.returnValue(of(true));

    // Act
    component.openDeleteDialog(userId);

    // Assert
    expect(matDialog.open).toHaveBeenCalledWith(UserDeleteDialogComponent);
    expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
  });

  it('should call UsersService.updateUser when openEditDialog is called with a user', () => {
    // Arrange
    const user: UserDto = { id: '123', username: 'John Doe' } as UserDto;


    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<UserEditorDialogComponent>>(['afterClosed']);

    matDialog.open.and.returnValue(matDialogRefSpy);
    matDialogRefSpy.afterClosed.and.returnValue(of(user));

    // Act
    component.openEditDialog(user);

    // Assert
    expect(matDialog.open).toHaveBeenCalledWith(UserEditorDialogComponent, {
      data: {
        user: user,
        mode: 'other'
      } as UserEditorData
    });
    expect(usersService.updateUser).toHaveBeenCalled();
  });

  it('should call UsersService.createUser when onFabClick is called', () => {
    // Arrange
    const user: CreateUserRequestDto = { id: '123', username: 'John Doe' } as CreateUserRequestDto;
    const matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<UserCreatorDialogComponent>>(['afterClosed']);

    matDialog.open.and.returnValue(matDialogRefSpy);
    matDialogRefSpy.afterClosed.and.returnValue(of(user));


    // Act
    component.onFabClick();

    // Assert
    expect(matDialog.open).toHaveBeenCalledWith(UserCreatorDialogComponent);
    expect(usersService.createUser).toHaveBeenCalledOnceWith(user);
  });
});
