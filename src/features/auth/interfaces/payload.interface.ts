import { Role } from "src/common/enums/role.enum";

export interface UserPayload {
  id: string;
  username: string;
  nickname: string;
  role: Role;
}
