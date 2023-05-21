import {Injectable} from '@angular/core';
import {CreateUserRequestDto, UserDto, UsersApiService} from "../../../core/api";
import {ApplicationStateService} from "../../../core/services/application-state.service";
import {SnackbarService} from "../../../core/services/snackbar.service";

@Injectable()
export class UsersService {

  constructor(
    private readonly usersApiService: UsersApiService,
    private readonly state: ApplicationStateService,
    private readonly snackbar: SnackbarService
  ) {
  }

  getAllUsers(): void {
    this.usersApiService.getAllUsers().subscribe({
      next: (users: UserDto[]) => this.state.patchState({users: users})
    });
  }

  createUser(userToBeCreated: CreateUserRequestDto): void {
    this.usersApiService.createUser(userToBeCreated).subscribe({
      next: (createdUser: UserDto) => {
        this.state.patchState(createdUser);
        this.snackbar.open('User created successfully!');
      }
    });
  }

  updateUser(userToUpdate: UserDto): void {
    this.usersApiService.updateUser(userToUpdate).subscribe({
      next: (updatedUser: UserDto) => {
        this.state.patchState(updatedUser);
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
