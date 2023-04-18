import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GameList, GameListDocument } from "src/common/models/game-list.schema";
import { Gender, LangEnum } from "src/common/types/game.type";
import { generateRandomTags } from "src/common/utils/game-tool";

@Injectable()
export class GameListService {
  constructor(
    @InjectModel(GameList.name)
    private readonly gameListModel: Model<GameListDocument>
  ) {}

  async createGameList(
    userId: string,
    title: string,
    playerName: string = "Player",
    playerGender: Gender = "Male",
    description?: string
  ): Promise<GameListDocument> {
    const tags = generateRandomTags(3);
    const newGameList = new this.gameListModel({
      userId,
      title,
      tags,
      playerName,
      playerGender,
      description: description ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newGameList.save();
  }

  async getAllGameLists(): Promise<GameListDocument[]> {
    return this.gameListModel.find().exec();
  }

  async getGameListById(id: string): Promise<GameListDocument> {
    return this.gameListModel.findById(id).exec();
  }

  async updateGameListById(
    id: string,
    tags: string[],
    lang: LangEnum,
    title: string
  ): Promise<GameListDocument> {
    const gameList = await this.getGameListById(id);
    gameList.title = title;
    gameList.tags = tags;
    gameList.lang = lang;
    gameList.updatedAt = new Date();

    await gameList.save();
    return gameList;
  }

  async deleteGameListById(id: string): Promise<boolean> {
    const result = await this.gameListModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
