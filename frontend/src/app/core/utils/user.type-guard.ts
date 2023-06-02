import {User} from "../models/user";

export function instanceOfUser(object: object): object is User {
  return 'username' in object &&
    'email' in object &&
    'id' in object &&
    'userType' in object;
}
