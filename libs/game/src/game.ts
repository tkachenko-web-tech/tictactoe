import { v4 as uuid } from 'uuid';

export enum STATE {
  NOT_FINISHED = 'NOT_FINISHED',
  TIE = 'TIE',
  WIN_X = 'WIN_X',
  WIN_O = 'WIN_O'
}

export type Square = 'X' | 'O' | ''

/*
0 1 2
3 4 5
6 7 8
 */

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
]

export class Game {

  id: string;
  xPlayerId: string;
  oPlayerId: string;
  turn: number;
  squares: Square[];
  state: string;
  winningSquares?: number[];

  constructor(playerId: string) {
    this.id = uuid();
    this.turn = 0;
    this.state = STATE.NOT_FINISHED;
    this.squares = Array(9).fill('');

    if (Math.random() < 0.5)
      this.xPlayerId = playerId;
    else
      this.oPlayerId = playerId;
  }

  static fromObject(obj) {
    const game = new Game('');
    game.id = obj.id;
    game.turn = obj.turn;
    game.state = obj.state;
    game.squares = obj.squares;
    game.xPlayerId = obj.xPlayerId;
    game.oPlayerId = obj.oPlayerId;
    game.winningSquares = obj.winningSquares;
    return game;
  }

  next() {
    return this.turn % 2 === 0 ? 'X' : 'O';
  }

  isFull() {
    return !!this.xPlayerId && !!this.oPlayerId;
  }

  checkForPlayer(playerId: string) {
    return playerId === this.xPlayerId || playerId === this.oPlayerId;
  }

  makeTurn(squareNumber: number) {
    if (this.squares[squareNumber] !== '' || this.state !== STATE.NOT_FINISHED)
      return
    this.squares[squareNumber] = this.turn % 2 === 0 ? 'X' : 'O';
    this.turn++;
    this.check();
  }

  check() {
    for (const win of wins) {
      const [a, b, c] = win;
      const word = this.squares[a] + this.squares[b] + this.squares[c];
      if (word === 'OOO' || word === 'XXX') {
        this.state = word === 'OOO' ? STATE.WIN_O : STATE.WIN_X;
        this.winningSquares = [a, b, c];
        return;
      }
    }

    if (this.turn >= 9)
      this.state = STATE.TIE;
  }

}
