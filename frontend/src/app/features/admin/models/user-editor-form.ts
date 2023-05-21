import {FormControl} from "@angular/forms";
import {UserDtoRoleEnum} from "../../../core/api";

export interface UserEditorForm {
  username: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<UserDtoRoleEnum>;
}
