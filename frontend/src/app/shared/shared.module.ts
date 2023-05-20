import {NgModule} from '@angular/core';
import {MaterialModule} from "./material.module";
import {AsyncPipe, DatePipe, NgIf, NgStyle} from "@angular/common";
import {FullCalendarModule} from '@fullcalendar/angular';
import {ReactiveFormsModule} from "@angular/forms";
import {FullCalendarWrapperComponent} from "./components/full-calendar-wrapper/full-calendar-wrapper.component";

const DIRECTIVES = [
  NgStyle,
  NgIf,
  AsyncPipe,
  DatePipe
];

const MODULES = [
  MaterialModule,
  FullCalendarModule,
  ReactiveFormsModule,
]

const DECLARATIONS = [
  FullCalendarWrapperComponent,
];

@NgModule({
  imports: [...MODULES, ...DIRECTIVES],
  exports: [...MODULES, ...DIRECTIVES, ...DECLARATIONS],
  declarations: [...DECLARATIONS]
})
export class SharedModule {
}

