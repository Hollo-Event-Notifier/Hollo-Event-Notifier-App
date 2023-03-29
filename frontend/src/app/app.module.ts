import {NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const DECLARATIONS = [
  AppComponent
];

const IMPORTS = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule
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
