import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { CommonUtility } from "src/core/utils/common.utility";
import {
  User,
  UserDocument,
  USER_MODEL_TOKEN,
} from "src/common/models/user.schema";
import { CreateUserDto, UpdateUserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_TOKEN)
    private readonly userModel: Model<UserDocument>
  ) {}

  async getAllUsers() {
    const users = await this.userModel.find().exec();
    return users;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { username, email, nickname, password, role } = createUserDto;
    const { salt, hash } = CommonUtility.encryptBySalt(password);

    const user = new this.userModel({
      username,
      email,
      nickname,
      password: {
        hash,
        salt,
      },
      role,
    });
    return user.save();
  }
  public async findUser(filter: FilterQuery<UserDocument>, select?: any) {
    const query = this.userModel.findOne(filter).select(select);
    const document = await query.exec();
    return document?.toJSON();
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    return user || null;
  }

  async getUserByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });

    return user || null;
  }

  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserDocument> {
    const user = await this.getUserById(id);

    if (updateUserDto.nickname !== undefined) {
      user.nickname = updateUserDto.nickname;
    }

    if (updateUserDto.password !== undefined) {
      const { salt, hash } = CommonUtility.encryptBySalt(
        updateUserDto.password
      );

      user.password = { hash, salt };
    }

    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }

    await user.save();
    return user;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return false;
    }
    return true;
  }

  public async hasUser() {
    const count = await this.userModel.estimatedDocumentCount().exec();
    return count > 0;
  }
}
