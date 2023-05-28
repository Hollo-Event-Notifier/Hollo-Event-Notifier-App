import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminRoutes} from "../../enums/admin-routes";
import {AppRoutes} from "../../../../app-routes";
import {Observable, Subject, takeUntil} from "rxjs";
import {User} from "../../../../core/models/user";
import {ApplicationStateService} from "../../../../core/services/application-state.service";
import {UserDtoRoleEnum} from "../../../../core/api";
import {TranslationService} from "../../../../core/services/translation.service";
import {MatDialog} from "@angular/material/dialog";
import {UserEditorDialogComponent} from "../user-editor-dialog/user-editor-dialog.component";
import {UsersService} from "../../../../core/services/users.service";
import {UserEditorData} from "../../models/user-editor-data";

@Component({
  selector: 'app-admin-root',
  templateUrl: './admin-root.component.html',
  styleUrls: ['./admin-root.component.scss']
})
export class AdminRootComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  readonly adminRoutes: typeof AdminRoutes = AdminRoutes;
  readonly appRoutes: typeof AppRoutes = AppRoutes
  readonly currentUser$: Observable<User>;
  readonly roles: typeof UserDtoRoleEnum = UserDtoRoleEnum;
  currentLanguage: string;
  currentUser!: User;

  constructor(
    private readonly state: ApplicationStateService,
    private readonly translationService: TranslationService,
    private readonly matDialog: MatDialog,
    private readonly usersService: UsersService
  ) {
    this.currentUser$ = state.currentUser$;
    this.currentLanguage = this.translationService.currentLanguage
  }

  ngOnInit(): void {
    this.state.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => this.currentUser = value)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeLanguage(): void {
    this.translationService.changeLanguage();
    this.currentLanguage = this.translationService.currentLanguage;
  }

  openEditorDialog(): void {
    this.matDialog.open(UserEditorDialogComponent, {
      data: {
        user: this.currentUser,
        mode: 'current'
      } as UserEditorData
    }).afterClosed().subscribe(
      (result: User | undefined) => {
        if (result !== undefined) {
          this.usersService.updateUser(result);
        }
      });
  }
}
