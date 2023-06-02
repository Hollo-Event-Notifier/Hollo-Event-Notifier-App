import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable()
export class SnackbarService {

  private config: MatSnackBarConfig = {
    duration: 1000,
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
    panelClass: '', // TODO define panel classes
    politeness: 'polite',
  }

  constructor(private snackBar: MatSnackBar) {
  }


  open(message: string, action?: string): void {
    this.snackBar.open(message, action, this.config);
  }
}
