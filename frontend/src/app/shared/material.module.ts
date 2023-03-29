// TODO: delete never type
import {NgModule} from "@angular/core";

const MATERIAL_COMPONENTS: never[] = [
]

@NgModule({
  imports: [...MATERIAL_COMPONENTS],
  exports: [...MATERIAL_COMPONENTS]
})
export class MaterialModule {
}
