import { container } from 'tsyringe';
import ProcessManagerService from '../services/process-manager.service';
import Redis from 'ioredis';
import { redis } from '../../shared/redis';
import RedisService from '../services/redis.service';

function registerDependencies() {
  container.register<Redis>(Redis, {
    useValue: redis,
  });
  container.register<RedisService>(RedisService, { useClass: RedisService });
  container.register<ProcessManagerService>(ProcessManagerService, {
    useClass: ProcessManagerService,
  });
}

registerDependencies();
