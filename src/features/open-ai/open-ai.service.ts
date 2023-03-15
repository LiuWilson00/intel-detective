import { Injectable } from "@nestjs/common";
import {
  Configuration,
  OpenAIApi,
  CreateChatCompletionRequest,
  CreateCompletionRequest,
} from "openai";
import { AxiosRequestConfig } from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAIApi;

  constructor(private readonly configService: ConfigService) {
    const configuration = new Configuration({
      apiKey: this.configService.get("open-ai.api-key"),
    });
    this.openai = new OpenAIApi(configuration);
  }

  async createCompletion(
    createCompletionRequest: CreateCompletionRequest,
    axiosRequestConfig?: AxiosRequestConfig
  ): Promise<string> {
    try {
      const response = await this.openai.createCompletion(
        createCompletionRequest,
        axiosRequestConfig
      );
      const choices = response.data.choices;

      if (choices.length === 0) {
        throw new Error("OpenAI API response is empty.");
      }

      return choices[0].text;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }

  async createChatCompletion(
    createChatCompletionRequest: CreateChatCompletionRequest,
    axiosRequestConfig?: AxiosRequestConfig
  ): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion(
        createChatCompletionRequest,
        axiosRequestConfig
      );
      const choices = response.data.choices;

      if (choices.length === 0) {
        throw new Error("OpenAI API response is empty.");
      }

      return choices[0].message.content;
    } catch (error) {
      throw new Error(`Error calling OpenAI API: ${error}`);
    }
  }
}
