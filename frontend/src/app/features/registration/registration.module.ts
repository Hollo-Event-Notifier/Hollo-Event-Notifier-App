import {NgModule} from '@angular/core';
import {RegistrationRoutingModule} from "./registration-routing.module";
import {RegistrationFormComponent} from "./components/registration-form/registration-form.component";
import {SharedModule} from "../../shared/shared.module";
import {SuccessComponent} from "./components/success/success.component";

const IMPORTS = [
  RegistrationRoutingModule,
  SharedModule
]

const DECLARATIONS = [
  RegistrationFormComponent,
  SuccessComponent
]

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS]
})
export class RegistrationModule {
}
