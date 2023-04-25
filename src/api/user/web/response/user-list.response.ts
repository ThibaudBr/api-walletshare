import { UserResponse } from './user.response';

export class UserListResponse {
  public userList: UserResponse[];
  constructor(users?: UserResponse[]) {
    if (users) {
      this.userList = users;
    } else {
      this.userList = [];
    }
  }
}
