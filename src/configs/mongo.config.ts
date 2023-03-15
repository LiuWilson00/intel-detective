import { registerAs } from "@nestjs/config";

export default registerAs("mongo", () => ({
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  resource: process.env.MONGO_RESOURCE,
  uri:
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}` +
    `@${process.env.MONGO_RESOURCE}?retryWrites=true&w=majority`,
}));
