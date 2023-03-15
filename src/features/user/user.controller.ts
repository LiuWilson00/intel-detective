import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { UserDocument } from "src/common/models/user.schema";
import { JwtAuthGuard, RoleGuard } from "src/core/guards";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserDocument> {
    const user = await this.userService.createUser(createUserDto);
    if (!user) {
      throw new BadRequestException("Failed to create user");
    }
    return user;
  }

  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<UserDocument> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Get(":username")
  async getUserByUsername(
    @Param("username") username: string
  ): Promise<UserDocument> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  @Put(":id")
  async updateUserById(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDocument> {
    const user = await this.userService.updateUserById(id, updateUserDto);
    if (!user) {
      throw new BadRequestException(`Failed to update user with id ${id}`);
    }
    return user;
  }

  @Patch(":id")
  async patchUserById(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDocument> {
    const user = await this.userService.updateUserById(id, updateUserDto);
    if (!user) {
      throw new BadRequestException(`Failed to update user with id ${id}`);
    }
    return user;
  }

  @Delete(":id")
  async deleteUserById(@Param("id") id: string): Promise<boolean> {
    const result = await this.userService.deleteUserById(id);
    if (!result) {
      throw new BadRequestException(`Failed to delete user with id ${id}`);
    }
    return result;
  }
}
