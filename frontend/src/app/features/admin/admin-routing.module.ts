import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AdminRootComponent} from "./components/admin-root/admin-root.component";

const routes: Routes = [
  {path: '', component: AdminRootComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
