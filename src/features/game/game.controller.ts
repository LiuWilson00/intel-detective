import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { StartGameDto } from "./dto/start-game.dto";
import { GameService } from "./game.service";
import { Occupation } from "./interfaces/occupations.interface";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post("start")
  async startGame(@Body() startGameDto: StartGameDto) {
    console.log("Starting game with:", startGameDto);
    const reulst = await this.gameService.startGame(startGameDto);
    return {
      message: "Game started",
      reulst,
    };
  }

  @Get("occupations")
  getOccupations(@Query("count") count: number): Occupation[] {
    const occupations = this.gameService.getRandomOccupations(count || 3); // 使用3作為預設值
    return occupations;
  }
}
