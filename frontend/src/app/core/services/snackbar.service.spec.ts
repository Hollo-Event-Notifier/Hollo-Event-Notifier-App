import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });
    service = TestBed.inject(SnackbarService);
    snackbarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.open method with message and action when open() is called', () => {
    // Arrange
    const message = 'Test message';
    const action = 'Test action';
    const config: MatSnackBarConfig = {
      duration: 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: '',
      politeness: 'polite'
    };

    // Act
    service.open(message, action);

    // Assert
    expect(snackbarSpy.open).toHaveBeenCalledWith(message, action, config);
  });
});
