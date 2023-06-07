import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AppRoutes} from "../../../../app-routes";


@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent {
  constructor(
    private readonly router: Router,
  ) {
  }

  navigateToLogin() {
    this.router.navigate([AppRoutes.Login])
  }
}
