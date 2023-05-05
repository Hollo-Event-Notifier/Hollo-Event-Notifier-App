import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EventDto} from "../../../../core/api";
import {SharedModule} from "../../../../shared/shared.module";
import {MatChipsModule} from "@angular/material/chips";

@Component({
  selector: 'app-display-dialog',
  templateUrl: './event-display-dialog.component.html',
  styleUrls: ['./event-display-dialog.component.scss'],
  standalone: true,
  imports: [SharedModule, MatChipsModule]
})
export class EventDisplayDialogComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<EventDisplayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: EventDto,
  ) {
  }

  onClose() {
    this.dialogRef.close();
  }
}

