import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        stores: [
          await redisStore({
            socket: {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
            },
          }),
        ],
        ttl: 0,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PrismaService, CacheService],
  exports: [PrismaService, CacheService, CacheModule], // Exporta o CacheModule para outros módulos que precisem dele
})
export class DatabaseModule {}
