export const config = {
  REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? null,
  SERVER_PORT: Number(process.env.SERVER_PORT ?? 3000),
  API_TOKEN: process.env.API_TOKEN ?? null,
  AUTO_READ_MESSAGES: Boolean(process.env.AUTO_READ_MESSAGE ?? true),
};

export type Config = typeof config;
