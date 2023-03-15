import { Module } from "@nestjs/common";
import { OpenAIService } from "./open-ai.service";
import { OpenAIController } from "./open-ai.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [OpenAIService],
  controllers: [OpenAIController],
  exports: [OpenAIService],
})
export class OpenAIModule {}
