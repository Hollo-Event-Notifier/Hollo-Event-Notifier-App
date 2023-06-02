import {FormControl} from "@angular/forms";
import {CreateUserRequestDtoRoleEnum} from "../../../core/api";

export interface UserCreatorForm {
  username: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<CreateUserRequestDtoRoleEnum>;
  password: FormControl<string>
}
