import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AdminRootComponent} from "./components/admin-root/admin-root.component";
import {AdminRoutes} from "./enums/admin-routes";
import {SettingsComponent} from "./components/settings/settings.component";
import {AdminEventDisplayComponent} from "./components/admin-event-display/admin-event-display.component";

const routes: Routes = [
  {
    path: AdminRoutes.Root,
    component: AdminRootComponent,
    children: [
      {
        path: AdminRoutes.Settings,
        component: SettingsComponent,
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
