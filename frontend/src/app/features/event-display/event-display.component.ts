import {Component} from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {EventDto} from "../../core/api";
import {Observable} from "rxjs";
import {EventInput} from "@fullcalendar/core";
import {ApplicationStateService} from "../../core/services/application-state.service";
import {EventsService} from "../../core/services/events.service";
import {MatDialog} from "@angular/material/dialog";
import {EventDisplayDialogComponent} from "./components/event-display-dialog/event-display-dialog.component";
import {TranslationService} from "../../core/services/translation.service";

@Component({
  selector: 'app-event-display-dialog',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
  imports: [SharedModule],
  standalone: true
})
export class EventDisplayComponent {
  events$!: Observable<EventInput[]>;

  currentLanguage : string;
  constructor(
    private readonly state: ApplicationStateService,
    private readonly eventsService: EventsService,
    private readonly matDialog: MatDialog,
    private readonly translationService: TranslationService,
  ) {
    this.events$ = state.events$;
    this.currentLanguage = this.translationService.currentLanguage;
  }
  changeLanguage(): void {
    this.translationService.changeLanguage();
    this.currentLanguage = this.translationService.currentLanguage;
  }

  onEventClick($event: EventDto) {
    this.matDialog.open(EventDisplayDialogComponent, {data: $event});
  }
}
