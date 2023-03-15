import { IsString, MaxLength, MinLength } from "class-validator";
import {
  USER_NICKNAME_MAX_LEN,
  USER_NICKNAME_MIN_LEN,
  USER_PASSWORD_MAX_LEN,
  USER_PASSWORD_MIN_LEN,
} from "src/common/constants/user.const";
import { Role } from "src/common/enums/role.enum";
export class UpdateUserDto {
  @IsString()
  @MinLength(USER_NICKNAME_MIN_LEN)
  @MaxLength(USER_NICKNAME_MAX_LEN)
  nickname?: string;

  @IsString()
  @MinLength(USER_PASSWORD_MIN_LEN)
  @MaxLength(USER_PASSWORD_MAX_LEN)
  password?: string;

  @IsString()
  role?: Role;
}
