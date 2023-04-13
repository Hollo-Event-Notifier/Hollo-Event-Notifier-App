import {NgModule} from '@angular/core';
import {MaterialModule} from "./material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgStyle} from "@angular/common";

const MODULES = [
  MaterialModule,
  ReactiveFormsModule,
  NgStyle
]

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class SharedModule {
}

