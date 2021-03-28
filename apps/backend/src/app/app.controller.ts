import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {
  }

  @Get('game/:gameId')
  getGame(
    @Param() gameId: string
  ) {
    return this.appService.getGame(gameId);
  }

  @Post('game/:gameId/join/:playerId')
  joinGame(
    @Param() gameId: string,
    @Param() playerId: string
  ) {
    return this.appService.join(gameId, playerId);
  }

  @Get('player/:playerId/game')
  getGameForPlayer(
    @Param() playerId: string
  ) {
    return this.appService.getGameForPlayer(playerId);
  }

  @Post('player/:playerId/game')
  createGame(
    @Param() playerId: string
  ) {
    return this.appService.createGame(playerId);
  }

  @Get('player/:playerId/isplaying')
  isPlaying(
    @Param() playerId: string
  ) {
    return this.appService.isPlaying(playerId);
  }

}
