import {NgModule} from '@angular/core';
import {AdminRootComponent} from './components/admin-root/admin-root.component';
import {AdminRoutingModule} from "./admin-routing.module";
import {SharedModule} from "../../shared/shared.module";

const DECLARATIONS = [
  AdminRootComponent
];

const IMPORTS = [
  AdminRoutingModule,
  SharedModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS]
})
export class AdminModule {
}
