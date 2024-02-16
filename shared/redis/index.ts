import Redis from 'ioredis';

export const redis = new Redis({
  host: 'redis',
  password: process.env.REDIS_PASSWORD,
});
