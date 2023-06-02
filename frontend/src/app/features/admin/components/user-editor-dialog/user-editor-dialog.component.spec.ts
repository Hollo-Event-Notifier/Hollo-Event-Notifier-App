import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UserEditorDialogComponent} from './user-editor-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserDtoRoleEnum} from '../../../../core/api';
import {User} from '../../../../core/models/user';
import {UserEditorData} from '../../models/user-editor-data';
import {getTranslocoModule} from "../../../../core/utils/transloco-testing.factory";

describe('UserEditorDialogComponent', () => {
  let component: UserEditorDialogComponent;
  let fixture: ComponentFixture<UserEditorDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<UserEditorDialogComponent>>;
  let dialogData: UserEditorData;

  beforeEach(() => {
    const dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [UserEditorDialogComponent],
      providers: [
        {provide: MatDialogRef, useValue: dialogSpy},
        {
          provide: MAT_DIALOG_DATA, useValue: {
            user: {
              id: '123',
              username: 'john.doe',
              email: 'john@example.com',
              role: UserDtoRoleEnum.EventAdmin,
              userType: 'current'
            },
            mode: 'other'
          }
        }
      ],
      imports: [getTranslocoModule()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditorDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UserEditorDialogComponent>>;
    dialogData = TestBed.inject(MAT_DIALOG_DATA) as UserEditorData;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange

    // Act

    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize the form group with the provided user data', () => {
    // Arrange
    const expectedFormGroupValue = {
      username: dialogData.user.username,
      email: dialogData.user.email,
      role: dialogData.user.role
    };

    // Act

    // Assert
    expect(component.formGroup.value).toEqual(expectedFormGroupValue);
  });

  it('should call MatDialogRef.close with the updated user data when onSave is called', () => {
    // Arrange
    const updatedUser: User = {
      id: dialogData.user.id,
      username: 'updatedUser',
      email: 'updated@example.com',
      role: UserDtoRoleEnum.EventAdmin,
      userType: dialogData.user.userType
    };
    component.formGroup.setValue({
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    });

    // Act
    component.onSave();

    // Assert
    expect(dialogRef.close).toHaveBeenCalledWith(updatedUser);
  });

  it('should call MatDialogRef.close without any arguments when onCancel is called', () => {
    // Arrange

    // Act
    component.onCancel();

    // Assert
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
