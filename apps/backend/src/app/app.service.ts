import { Injectable } from '@nestjs/common';
import { Game, STATE } from '@tictactoe/game';

@Injectable()
export class AppService {

  games: Map<string, Game> = new Map<string, Game>(); // id: game

  isPlaying(playerId: string): boolean {
    for (const [id, game] of this.games) {
      if (game.checkForPlayer(playerId))
        return true;
    }
    return false;
  }

  getGame(gameId: string): Game | {} {
    if (!this.games.has(gameId)) return {};
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

  next(gameId: string): 'X' | 'O' {
    if (this.games.has(gameId))
      return this.games.get(gameId).next();
  }

  isPlayerNext(gameId: string, playerId: string): boolean {
    if (this.games.has(gameId)) {
      const game = this.games.get(gameId);
      return (game.xPlayerId === playerId && game.next() === 'X') || (game.oPlayerId === playerId && game.next() === 'O');
    }
  }

  getGameForPlayer(playerId: string): Game {
    for (const [id, game] of this.games) {
      if (game.checkForPlayer(playerId))
        return game;
    }
    return null;
  }

  isGameStarted(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game)
      return false;
    return !(!game.xPlayerId || !game.oPlayerId);
  }

  createGame(playerId: string): Game {
    const prevGame = this.getGameForPlayer(playerId);
    if (prevGame) this.games.delete(prevGame.id);
    const game = new Game(playerId);
    this.games.set(game.id, game);
    return game;
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
