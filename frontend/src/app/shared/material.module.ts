import {NgModule} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import {MatDivider, MatDividerModule} from "@angular/material/divider";

const MATERIAL_MODULES = [
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatDialogModule,
  MatChipsModule,
  MatMenuModule,
  MatSelectModule,
  MatDividerModule
]

@NgModule({
  imports: [...MATERIAL_MODULES],
  exports: [...MATERIAL_MODULES]
})
export class MaterialModule {
}
