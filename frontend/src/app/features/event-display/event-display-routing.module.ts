import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {EventDisplayComponent} from "./components/event-display/event-display.component";
import {EventDisplayRoutes} from "./enums/event-display-routes";


const routes: Routes = [
  {
    path: EventDisplayRoutes.EventDisplay,
    component: EventDisplayComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventDisplayRoutingModule { }
