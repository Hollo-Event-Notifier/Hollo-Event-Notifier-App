import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutes} from "./app-routes";
import {AuthGuardService} from "./core/services/auth-guard.service";

const routes: Routes = [
  {
    path: AppRoutes.EventDisplay,
    loadChildren: () => import('./features/event-display/routes'),
  },
  {
    path: AppRoutes.Login,
    loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: AppRoutes.Admin,
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
