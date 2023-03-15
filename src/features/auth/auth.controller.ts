import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from "@nestjs/common";

import { LocalAuthGuard } from "../../core/guards";

import { CreateUserDto, UserService } from "../user";

import { User } from "./decorators/payload.decorator";
import { UserPayload } from "./interfaces/payload.interface";

import { AuthService } from "./auth.service";
import { Role } from "src/common/enums/role.enum";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post("/signup")
  async signup(@Body() dto: CreateUserDto) {
    const existingUser = await this.userService.getUserByUsername(dto.username);
    if (existingUser) {
      throw new BadRequestException("Username already exists");
    }
    const user = await this.userService.createUser(dto);
    const { _id: id, username, role, nickname } = user;
    const _role = role as Role;

    return this.authService.generateJwt({
      id,
      username,
      nickname,
      role: _role,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post("/signin")
  signin(@User() user: UserPayload) {
    return this.authService.generateJwt(user);
  }
}
