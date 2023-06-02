import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AdminRootComponent} from "./components/admin-root/admin-root.component";
import {AdminRoutes} from "./enums/admin-routes";
import {SettingsComponent} from "./components/settings/settings.component";
import {AdminEventDisplayComponent} from "./components/admin-event-display/admin-event-display.component";
import {SettingsGuardService} from "./services/settings-guard.service";

const routes: Routes = [
  {
    path: AdminRoutes.Root,
    component: AdminRootComponent,
    children: [
      {
        path: AdminRoutes.Settings,
        component: SettingsComponent,
        canActivate: [SettingsGuardService]
      },
      {
        path: AdminRoutes.EventDisplay,
        component: AdminEventDisplayComponent,
      },
      {
        path: '**',
        redirectTo: AdminRoutes.EventDisplay,
        pathMatch: 'full'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
