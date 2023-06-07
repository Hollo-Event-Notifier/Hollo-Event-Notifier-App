import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RegistrationRoutes} from "./enums/registration-routes";
import {RegistrationFormComponent} from "./components/registration-form/registration-form.component";
import {SuccessComponent} from "./components/success/success.component";


const routes: Routes = [
  {
    path: RegistrationRoutes.Root,
    component: RegistrationFormComponent,
  },
  {
    path: RegistrationRoutes.Success,
    component: SuccessComponent,
  },
  {
    path: '**',
    redirectTo: RegistrationRoutes.Root,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {
}
