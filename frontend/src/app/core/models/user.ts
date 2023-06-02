import {UserDto} from "../api";

export interface User extends UserDto {
  userType: 'current' | 'other';
}
