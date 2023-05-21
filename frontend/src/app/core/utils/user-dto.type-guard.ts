import {UserDto} from "../api";

export function instanceOfUserDto(object: object): object is UserDto {
  return 'username' in object &&
    'email' in object &&
    'id' in object;
}
