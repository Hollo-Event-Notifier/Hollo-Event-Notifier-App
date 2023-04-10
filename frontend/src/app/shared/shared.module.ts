import {NgModule} from '@angular/core';
import {MaterialModule} from "./material.module";
import {ReactiveFormsModule} from "@angular/forms";

const MODULES = [
  MaterialModule,
  ReactiveFormsModule
]

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class SharedModule {
}

