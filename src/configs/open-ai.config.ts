import { registerAs } from "@nestjs/config";

export default registerAs("open-ai", () => {
  const api_key = process.env.OPENAI_API_KEY;
  return { "api-key": api_key };
});
