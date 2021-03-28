import { Injectable } from '@nestjs/common';
import { Game, STATE } from '@tictactoe/game';

@Injectable()
export class AppService {

  games: Map<string, Game>; // id: game

  isPlaying(playerId: string): boolean {
    this.games.forEach(game => {
      if (game.checkForPlayer(playerId))
        return true;
    })
    return false;
  }

  getGame(gameId: string): Game {
    if (!this.games.has(gameId)) return null;
    return this.games.get(gameId);
  }

  join(gameId: string, playerId: string): Game {
    if (!this.games.has(gameId)) return null;
    const game = this.games.get(gameId);
    if (game.xPlayerId && game.oPlayerId)
      return null;
    if (game.xPlayerId) {
      game.oPlayerId = playerId;
    } else {
      game.xPlayerId = playerId;
    }
    return game;
  }

  next(gameId: string) {
    const game = this.games.get(gameId);
    return game.turn % 2 === 0 ? game.xPlayerId : game.oPlayerId;
  }

  getWinningSquares(gameId: string) {

  }

  getGameForPlayer(playerId: string): Game {
    this.games.forEach(game => {
      if (game.checkForPlayer(playerId))
        return game;
    })
    return null;
  }

  isGameStarted(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game)
      return false;
    return !(!game.xPlayerId || !game.oPlayerId);
  }

  createGame(playerId: string): Game {
    if (!this.isPlaying(playerId)) {
      const game = new Game(playerId);
      this.games.set(game.id, game);
      return game;
    }
    return null;
  }

  makeTurn(gameId: string, squareNumber: number) {
    const game = this.games.get(gameId);
    if (!game) return;
    game.makeTurn(squareNumber);
    if (game.state !== STATE.NOT_FINISHED)
      this.games.delete(game.id);
    return game;
  }

}
