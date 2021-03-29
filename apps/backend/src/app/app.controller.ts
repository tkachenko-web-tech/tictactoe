import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Game } from '@tictactoe/game';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {
  }

  @Get('game/:gameId')
  getGame(
    @Param('gameId') gameId: string
  ): Game | {} {
    return this.appService.getGame(gameId);
  }

  @Post('game/:gameId/join/:playerId')
  joinGame(
    @Param('gameId') gameId: string,
    @Param('playerId') playerId: string
  ): Game {
    return this.appService.join(gameId, playerId);
  }

  @Get('player/:playerId/game')
  getGameForPlayer(
    @Param('playerId') playerId: string
  ): Game {
    return this.appService.getGameForPlayer(playerId);
  }

  @Post('player/:playerId/game')
  createGame(
    @Param('playerId') playerId: string
  ): Game {
    return this.appService.createGame(playerId);
  }

  @Get('player/:playerId/isplaying')
  isPlaying(
    @Param('playerId') playerId: string
  ): { isPlaying: boolean } {
    return { isPlaying: this.appService.isPlaying(playerId) };
  }

  @Get('game/:gameId/isstarted')
  isStarted(
    @Param('gameId') gameId: string
  ): { isStarted: boolean } {
    return { isStarted: this.appService.isGameStarted(gameId) };
  }

}
