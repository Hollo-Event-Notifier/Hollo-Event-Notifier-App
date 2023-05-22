import {NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from "./core/core.module";
import {LoginComponent} from "./features/login/login.component";
import {EventDisplayComponent} from "./features/event-display/event-display.component";

const DECLARATIONS = [
  AppComponent
];

const IMPORTS = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  CoreModule,
  LoginComponent,
  EventDisplayComponent,
];

const PROVIDERS: Provider[] = [];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [...PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
}
