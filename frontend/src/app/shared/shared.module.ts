import {NgModule} from '@angular/core';
import {MaterialModule} from "./material.module";

const MODULES = [
  MaterialModule,
]

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class SharedModule {
}

