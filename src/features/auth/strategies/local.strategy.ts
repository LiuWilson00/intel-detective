import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { UserPayload } from "../interfaces/payload.interface";

import { AuthService } from "../auth.service";
import { Role } from "src/common/enums/role.enum";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload: UserPayload = {
      id: user._id,
      nickname: user.nickname,
      username: user.username,
      role: user.role as Role,
    };
    return payload;
  }
}
