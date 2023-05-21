import {Component, OnInit} from '@angular/core';
import {ApplicationStateService} from "../../../../core/services/application-state.service";
import {Observable} from "rxjs";
import {CreateUserRequestDto, UserDto} from "../../../../core/api";
import {UsersService} from "../../services/users.service";
import {MatDialog} from "@angular/material/dialog";
import {UserDeleteDialogComponent} from "../user-delete-dialog/user-delete-dialog.component";
import {UserEditorDialogComponent} from "../user-editor-dialog/user-editor-dialog.component";
import {UserCreatorDialogComponent} from "../user-creator-dialog/user-creator-dialog.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  readonly users$: Observable<UserDto[]>;

  constructor(
    private readonly state: ApplicationStateService,
    private readonly usersService: UsersService,
    private readonly matDialog: MatDialog
  ) {
    this.users$ = this.state.users$;
  }

  ngOnInit(): void {
    this.usersService.getAllUsers();
  }

  openDeleteDialog(userId: string): void {
    this.matDialog.open(UserDeleteDialogComponent).afterClosed().subscribe(
      (value: boolean) => value ? this.usersService.deleteUser(userId) : ''
    );
  }

  openEditDialog(user: UserDto): void {
    this.matDialog.open(UserEditorDialogComponent, {data: user}).afterClosed().subscribe(
      (result: UserDto | undefined) => {
        if (result !== undefined) {
          this.usersService.updateUser(result);
        }
      });
  }

  onFabClick() {
    this.matDialog.open(UserCreatorDialogComponent).afterClosed().subscribe(
      (result: CreateUserRequestDto | undefined) => {
        if (result !== undefined) {
          this.usersService.createUser(result);
        }
      });
  }
}
