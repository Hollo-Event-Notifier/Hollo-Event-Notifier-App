import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-user-delete-dialog',
  templateUrl: './user-delete-dialog.component.html',
  styleUrls: ['./user-delete-dialog.component.scss']
})
export class UserDeleteDialogComponent {
  constructor(private readonly dialogRef: MatDialogRef<UserDeleteDialogComponent>) {
  }

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
