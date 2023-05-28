import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDeleteDialogComponent } from './user-delete-dialog.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

describe('UserDeleteDialogComponent', () => {
  let component: UserDeleteDialogComponent;
  let fixture: ComponentFixture<UserDeleteDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<UserDeleteDialogComponent>>;

  beforeEach(() => {
    const dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [UserDeleteDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy }
      ],
      imports: [MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDeleteDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UserDeleteDialogComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange

    // Act

    // Assert
    expect(component).toBeTruthy();
  });

  it('should call MatDialogRef.close with the provided result when close is called', () => {
    // Arrange
    const expectedResult = true;

    // Act
    component.close(expectedResult);

    // Assert
    expect(dialogRef.close).toHaveBeenCalledWith(expectedResult);
  });
});
