import {Injectable} from '@angular/core';
import {CreateUserRequestDto, UserCredentialsDto, UserDto, UsersApiService} from "../api";
import {ApplicationStateService} from "./application-state.service";
import {SnackbarService} from "./snackbar.service";
import {take} from "rxjs";
import {AppRoutes} from "../../app-routes";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "../models/user";

@Injectable()
export class UsersService {
  private currentUser!: User;

  constructor(
    private readonly usersApiService: UsersApiService,
    private readonly state: ApplicationStateService,
    private readonly snackbar: SnackbarService,
    private readonly router: Router
  ) {
    state.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  loginUser(credentials: UserCredentialsDto): void {
    this.usersApiService.login(credentials)
      .pipe(take(1))
      .subscribe({
        next: (currentUser: UserDto) => {
          this.state.patchState({...currentUser, userType: 'current'});
          this.router.navigate([AppRoutes.Admin]).then();
        },
        error: (err: HttpErrorResponse) => this.snackbar.open(err?.error)
      });
  }

  getAllUsers(): void {
    this.usersApiService.getAllUsers().subscribe({
      next: (users: UserDto[]) => this.state.patchState({
        users: users
          .filter(user => user.id !== this.currentUser.id)
          .map<User>(user => {
            return {...user, userType: 'other'}
          })
      })
    });
  }

  createUser(userToBeCreated: CreateUserRequestDto): void {
    this.usersApiService.createUser(userToBeCreated).subscribe({
      next: (createdUser: UserDto) => {
        this.state.patchState({...createdUser, userType: 'other'});
        this.snackbar.open('User created successfully!');
      }
    });
  }

  updateUser(userToUpdate: User): void {
    this.usersApiService.updateUser(userToUpdate).subscribe({
      next: (updatedUser: UserDto) => {
        this.state.patchState({...updatedUser, userType: userToUpdate.userType});
        this.snackbar.open('User updated successfully!')
      }
    })
  }

  deleteUser(id: string): void {
    this.usersApiService.deleteUserById(id).subscribe({
      next: () => {
        this.state.patchState(id);
        this.snackbar.open('User deleted successfully!');
      }
    })
  }
}
