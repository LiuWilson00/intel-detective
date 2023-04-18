import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";

import mongoConfigFactory from "./configs/mongo.config";
import secretConfigFactory from "./configs/secret.config";
import openAiConfigFactory from "./configs/open-ai.config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ResponseInterceptor } from "./core/interceptors";
import { UserModule } from "./features/user/user.module";
import { AuthModule } from "./features/auth/auth.module";
import { AuthorizationModule } from "./core/modules/authorization/authorization.module";
import { join } from "path";

import { OpenAIModule } from "./features/open-ai/open-ai.module";
import { SuggestNamesModule } from "./features/suggest-names/suggest-names.module";
import { GameModule } from "./features/game/game.module";
import { JsonToolModule } from "./common/utils/json-tool/json-tool.module";
import { GameHistoryModule } from "./features/game-history/game-history.module";
import { GameListService } from "./features/game-list/game-list.service";
import { GameListModule } from "./features/game-list/game-list.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfigFactory, secretConfigFactory, openAiConfigFactory],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get<string>("mongo.uri"),
        };
      },
    }),
    UserModule,
    AuthModule,
    AuthorizationModule,
    AuthorizationModule.register({
      modelPath: join(__dirname, "../rbac/model.conf"),
      policyAdapter: join(__dirname, "../rbac/policy.csv"),
      global: true,
    }),
    OpenAIModule,
    SuggestNamesModule,
    GameModule,
    JsonToolModule,
    GameHistoryModule,
    GameListModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
