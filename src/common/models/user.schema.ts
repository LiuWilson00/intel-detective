import {
  Prop,
  Schema,
  SchemaFactory,
  raw,
  ModelDefinition,
} from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
    USER_NICKNAME_MAX_LEN,
  USER_NICKNAME_MIN_LEN,
  USER_USERNAME_MAX_LEN,
  USER_USERNAME_MIN_LEN,
} from "../constants/user.const";
import { Role } from "../enums/role.enum";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    required: true,
    minlength: USER_USERNAME_MIN_LEN,
    maxlength: USER_USERNAME_MAX_LEN,
  })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    required: true,
    minlength: USER_NICKNAME_MIN_LEN,
    maxlength: USER_NICKNAME_MAX_LEN,
  })
  nickname: string;

  @Prop({
    required: true,
    type: raw({
      hash: String,
      salt: String,
    }),
  })
  password: { hash: string; salt: string };

  @Prop({
    required: true,
    default: Role.MANAGER,
    enum: Role,
  })
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const USER_MODEL_TOKEN = User.name;

export const UserDefinition: ModelDefinition = {
  name: USER_MODEL_TOKEN,
  schema: UserSchema,
};
