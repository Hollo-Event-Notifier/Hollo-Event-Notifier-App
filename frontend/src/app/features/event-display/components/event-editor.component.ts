import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-components',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent {
  eventForm: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  save():void{}
}

