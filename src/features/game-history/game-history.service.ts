import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  GameHistory,
  GameHistoryDocument,
} from "src/common/models/game-history.schema";
import { CreateGameHistoryDto, UpdateGameHistoryDto } from "./dto";

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectModel(GameHistory.name)
    private readonly gameHistoryModel: Model<GameHistoryDocument>
  ) {}

  async getAllGameHistories() {
    const gameHistories = await this.gameHistoryModel.find().exec();
    return gameHistories;
  }

  async createGameHistory(
    createGameHistoryDto: CreateGameHistoryDto
  ): Promise<GameHistoryDocument> {
    const { userId, gameId, gameRound, characterState } = createGameHistoryDto;

    const gameHistory = new this.gameHistoryModel({
      userId,
      gameId,
      round: gameRound,
      state: characterState,
    });
    return gameHistory.save();
  }

  async getGameHistoryById(id: string): Promise<GameHistoryDocument> {
    const gameHistory = await this.gameHistoryModel.findById(id);

    return gameHistory || null;
  }

  async getGameHistoriesByUserId(
    userId: string
  ): Promise<GameHistoryDocument[]> {
    const gameHistories = await this.gameHistoryModel.find({ userId });

    return gameHistories;
  }

  async updateGameHistoryById(
    id: string,
    updateGameHistoryDto: UpdateGameHistoryDto
  ): Promise<GameHistoryDocument> {
    const gameHistory = await this.getGameHistoryById(id);

    if (updateGameHistoryDto.gameRound !== undefined) {
      gameHistory.round = updateGameHistoryDto.gameRound;
    }

    if (updateGameHistoryDto.characterState !== undefined) {
      gameHistory.state = updateGameHistoryDto.characterState;
    }

    await gameHistory.save();
    return gameHistory;
  }

  async deleteGameHistoryById(id: string): Promise<boolean> {
    const result = await this.gameHistoryModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return false;
    }
    return true;
  }

  async getLatestNGameHistoriesByUserId(
    userId: string,
    n: number
  ): Promise<GameHistoryDocument[]> {
    const gameHistories = await this.gameHistoryModel
      .find({ userId })
      .sort({ timestamp: -1 }) // Sort by descending timestamp (most recent first)
      .limit(n)
      .exec();

    return gameHistories;
  }
  async updatePlayerSelection(
    id: string,
    playerSelection: string
  ): Promise<GameHistoryDocument> {
    const gameHistory = await this.getGameHistoryById(id);

    if (gameHistory) {
      gameHistory.playerSelected = true;
      gameHistory.playerSelection = playerSelection;
      await gameHistory.save();
    }

    return gameHistory;
  }
}
