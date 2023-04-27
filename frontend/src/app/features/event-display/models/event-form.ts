import {FormControl} from "@angular/forms";

export interface EventForm {
  title: FormControl<string>;
  place: FormControl<string>;
  organizer: FormControl<string>;
  hasPoints: FormControl<boolean>;
}
