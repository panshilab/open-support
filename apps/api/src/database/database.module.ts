import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/config.module';
import { EnvService } from '../config/env.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        const database = env.database;

        return {
          type: 'postgres' as const,
          host: database.host,
          port: database.port,
          username: database.user,
          password: database.password,
          database: database.name,
          autoLoadEntities: true,
          synchronize: false,
          ssl: database.ssl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
