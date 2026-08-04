import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import { validateEnv } from './env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class AppConfigModule {}
