import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        MatSnackBar
      ]
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
