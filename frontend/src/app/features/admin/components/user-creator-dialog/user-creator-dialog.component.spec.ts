import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { UserCreatorDialogComponent } from './user-creator-dialog.component';
import { CreateUserRequestDtoRoleEnum } from '../../../../core/api';
import {getTranslocoModule} from "../../../../core/utils/transloco-testing.factory";

describe('UserCreatorDialogComponent', () => {
  let component: UserCreatorDialogComponent;
  let fixture: ComponentFixture<UserCreatorDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserCreatorDialogComponent>>;

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [UserCreatorDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy }
      ],
      imports: [
        getTranslocoModule()
      ]
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UserCreatorDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    // Arrange

    // Act

    // Assert
    expect(component).toBeTruthy();
  });

  it('should close the dialog with formGroup value on onSave', () => {
    // Arrange
    const formGroupValue = {
      username: 'test',
      role: CreateUserRequestDtoRoleEnum.EventAdmin,
      email: 'test@example.com',
      password: 'Test1234'
    };
    component.formGroup.setValue(formGroupValue);

    // Act
    component.onSave();

    // Assert
    expect(dialogRefSpy.close).toHaveBeenCalledWith(formGroupValue);
  });

  it('should close the dialog without a value on onCancel', () => {
    // Arrange

    // Act
    component.onCancel();

    // Assert
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should toggle the password visibility', () => {
    // Arrange
    component.showPassword = false;

    // Act
    component.togglePasswordVisibility();

    // Assert
    expect(component.showPassword).toBe(true);

    // Act
    component.togglePasswordVisibility();

    // Assert
    expect(component.showPassword).toBe(false);
  });

  it('should initialize roles array with CreateUserRequestDtoRoleEnum values', () => {
    // Arrange

    // Act

    // Assert
    expect(component.roles).toEqual(Object.values(CreateUserRequestDtoRoleEnum));
  });
});
