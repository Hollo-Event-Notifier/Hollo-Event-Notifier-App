import {NgModule} from '@angular/core';
import {MaterialModule} from "./material.module";
import {AsyncPipe, NgIf, NgStyle} from "@angular/common";
import {FullCalendarModule} from '@fullcalendar/angular';
import {ReactiveFormsModule} from "@angular/forms";


const DIRECTIVES = [
  NgStyle,
  NgIf,
  AsyncPipe,
];

const MODULES = [
  MaterialModule,
  FullCalendarModule,
  ReactiveFormsModule,
]

@NgModule({
  imports: [...MODULES, ...DIRECTIVES],
  exports: [...MODULES, ...DIRECTIVES]
})
export class SharedModule {
}

