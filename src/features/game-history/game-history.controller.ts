import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GameHistoryService } from "./game-history.service";
import { CreateGameHistoryDto, UpdateGameHistoryDto } from "./dto";
import { JwtAuthGuard } from "src/core/guards";
@UseGuards(JwtAuthGuard)
@Controller("game-history")
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Get()
  async getAllGameHistories() {
    return this.gameHistoryService.getAllGameHistories();
  }

  @Get("/user/:userId")
  async getGameHistoriesByUserId(@Param("userId") userId: string) {
    return this.gameHistoryService.getGameHistoriesByUserId(userId);
  }

  @Get("/user/:userId/latest")
  async getLatestNGameHistoriesByUserId(
    @Param("userId") userId: string,
    @Query("n") n: number
  ) {
    return this.gameHistoryService.getLatestNGameHistoriesByUserId(userId, n);
  }

  @Get("/:id")
  async getGameHistoryById(@Param("id") id: string) {
    return this.gameHistoryService.getGameHistoryById(id);
  }

  @Post()
  async createGameHistory(@Body() createGameHistoryDto: CreateGameHistoryDto) {
    return this.gameHistoryService.createGameHistory(createGameHistoryDto);
  }

  @Put("/:id")
  async updateGameHistoryById(
    @Param("id") id: string,
    @Body() updateGameHistoryDto: UpdateGameHistoryDto
  ) {
    return this.gameHistoryService.updateGameHistoryById(
      id,
      updateGameHistoryDto
    );
  }

  @Delete("/:id")
  async deleteGameHistoryById(@Param("id") id: string) {
    return this.gameHistoryService.deleteGameHistoryById(id);
  }
}
