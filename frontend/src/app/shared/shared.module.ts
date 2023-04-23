import {NgModule} from '@angular/core';
import {MaterialModule} from "./material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgIf, NgStyle} from "@angular/common";
import {FullCalendarModule} from '@fullcalendar/angular';


const DIRECTIVES = [
  NgStyle,
  NgIf,
];

const MODULES = [
  MaterialModule,
  ReactiveFormsModule,
  FullCalendarModule
]

@NgModule({
  imports: [...MODULES, ...DIRECTIVES],
  exports: [...MODULES, ...DIRECTIVES]
})
export class SharedModule {
}

