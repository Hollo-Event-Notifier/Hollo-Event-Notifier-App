import {User} from "../../../core/models/user";

export interface UserEditorData {
  user: User;
  mode:'current' | 'other';
}
