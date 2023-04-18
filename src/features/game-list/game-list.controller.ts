import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { GameListService } from "./game-list.service";
import { CreateGameListDto, UpdateGameListDto } from "./dto";
import { JwtAuthGuard } from "src/core/guards";
import { User, UserPayload } from "../auth";

@UseGuards(JwtAuthGuard)
@Controller("game-list")
export class GameListController {
  constructor(private readonly gameListService: GameListService) {}

  @Post()
  async createGameList(
    @Body() createGameListDto: CreateGameListDto,
    @User() user: UserPayload
  ) {
    return this.gameListService.createGameList(
      user.id,
      createGameListDto.title,
      createGameListDto.playerName,
      createGameListDto.playerGender,
      createGameListDto.description
    );
  }

  @Get()
  async getAllGameLists() {
    return this.gameListService.getAllGameLists();
  }

  @Get(":id")
  async getGameListById(@Param("id") id: string) {
    const gameList = await this.gameListService.getGameListById(id);
    if (!gameList) {
      throw new NotFoundException("Game List not found");
    }
    return gameList;
  }

  @Put(":id")
  async updateGameListById(
    @Param("id") id: string,
    @Body() updateGameListDto: UpdateGameListDto
  ) {
    const updatedGameList = await this.gameListService.updateGameListById(
      id,
      updateGameListDto.tags,
      updateGameListDto.lang,
      updateGameListDto.title
    );

    if (!updatedGameList) {
      throw new NotFoundException("Game List not found");
    }

    return updatedGameList;
  }

  @Delete(":id")
  async deleteGameListById(@Param("id") id: string) {
    const result = await this.gameListService.deleteGameListById(id);
    if (!result) {
      throw new NotFoundException("Game List not found");
    }
    return { message: "Game List deleted successfully" };
  }
}
