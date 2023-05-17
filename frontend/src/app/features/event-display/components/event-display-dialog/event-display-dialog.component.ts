import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EventDto} from "../../../../core/api";
import {SharedModule} from "../../../../shared/shared.module";
import {TranslocoModule, TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-display-dialog',
  templateUrl: './event-display-dialog.component.html',
  styleUrls: ['./event-display-dialog.component.scss'],
  standalone: true,
  imports: [SharedModule, TranslocoModule]
})
export class EventDisplayDialogComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<EventDisplayDialogComponent>,
    private translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) readonly data: EventDto,
  ) {
  }
  switchLanguage(language : string) {
    this.translocoService.setActiveLang(language);
  }
  onClose() {
    this.dialogRef.close();
  }
}

