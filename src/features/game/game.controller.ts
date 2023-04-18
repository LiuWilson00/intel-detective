import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { getRandomOccupations } from "src/common/utils/game-tool";
import { Occupation } from "src/common/utils/game-tool/interfaces/occupations.interface";
import { JwtAuthGuard } from "src/core/guards";
import { User, UserPayload } from "../auth";
import { StartGameDto } from "./dto/start-game.dto";
import { GameService } from "./game.service";

@UseGuards(JwtAuthGuard)
@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post("start")
  async startGame(
    @Body() startGameDto: StartGameDto,
    @User() user: UserPayload
  ) {
    const result = await this.gameService.startGame(startGameDto, user.id);
    return {
      message: "Game started",
      result,
    };
  }

  @Get("occupations")
  getOccupations(@Query("count") count: number): Occupation[] {
    const occupations = getRandomOccupations(count || 3); // 使用3作為預設值
    return occupations;
  }

  @Post("next-session")
  async generateNextGameSession(
    @Body("option") option: string,
    @Body("gameId") gameId: string,
    @User() user: UserPayload
  ) {
    try {
      const nextGameSession = await this.gameService.generateNextGameSession({
        option,
        userId: user.id,
        gameId,
      });

      return nextGameSession;
    } catch (error) {
      console.error(`Error generating next game session: ${error.message}`);
      return { error: error.message };
    }
  }
}
