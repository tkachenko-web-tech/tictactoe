import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesGateway } from './games.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GamesGateway],
})
export class AppModule {}
