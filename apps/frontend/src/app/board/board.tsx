import React, { useEffect, useState } from 'react';

import './board.module.css';
import { Game } from '@tictactoe/game';
import { BACKEND_PORT, HOST_ADDRESS, WS_PORT } from '@tictactoe/config';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import socketIOClient from 'socket.io-client';

/* eslint-disable-next-line */
export interface BoardProps {
  gameId: string;
}

export function Board(props: BoardProps) {

  const cookies = new Cookies();
  const [squares, setSquares] = useState([]);
  const [gameInfo, setGameInfo] = useState('');
  const [playerRole, setPlayerRole] = useState('WATCHER');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [next, setNext] = useState(null);
  const [gameId, setGameId] = useState(null);
  const socket = socketIOClient(`${HOST_ADDRESS}:${WS_PORT}`, { transports: ['websockets'] });

  useEffect(() => {
    const init = async () => {
      console.log(socket)
      const game: Game = await fetch(`${HOST_ADDRESS}:${BACKEND_PORT}/game/${props.gameId}`).then(res => res.json());
      if (!game.id) {
        setGameInfo('Игры не существует');
        return;
      }

      setGameInfo('Ждите присоединения второго игрока');
      setGameId(game.id);
      setSquares(game.squares);

      setNext(game.turn % 2 == 0 ? 'X' : 'O');

      let playerId = cookies.get('playerId');
      if (!playerId) {
        playerId = uuid();
        cookies.set('playerId', playerId);
      }

      if ((!game.xPlayerId || !game.oPlayerId) && game.xPlayerId !== playerId && game.oPlayerId !== playerId) {
        await fetch(`${HOST_ADDRESS}:${BACKEND_PORT}/game/${game.id}/join/${playerId}`, { method: 'POST' }).then(res => res.json());
      }
      if (game.xPlayerId === playerId)
        setPlayerRole('X');
      else
        setPlayerRole('O');

      socket.emit('msg', JSON.stringify(
        {
          eventType: 'JOIN',
          playerId,
          gameId: game.id
        }
      ));

      console.log(await fetch(`${HOST_ADDRESS}:${BACKEND_PORT}/game/${game.id}`).then(res => res.json()))

      socket.on('msg', data => {
        if (data.eventType === 'TURN') {
          const game: Game = data.game;
          setSquares(game.squares);
          setNext(game.turn % 2 == 0 ? 'X' : 'O');
        } else if (data.eventType === 'JOIN') {
          setIsGameStarted(true);
        } else if (data.eventType === 'DISCONNECT') {
          setIsGameStarted(false);
        }
      });

    };

    init();
  }, []);

  function makeTurn(squareNumber: number) {
    const playerId = cookies.get('playerId');
    socket.emit('msg', JSON.stringify({
      eventType: 'TURN',
      gameId,
      playerId,
      squareNumber
    }));
  }

  function Square(props: any) {
    let isDisabled = false;
    if (next !== playerRole || squares[props.index] !== '' || !isGameStarted)
      isDisabled = true;

    return (
      <div className='square'>
        <button disabled={isDisabled} onClick={() => makeTurn(props.index)}>{squares[props.index]}</button>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='game-info'>{gameInfo}</div>
      <div className='board'>
        {squares.map((square, i) => (<Square key={i} index={i} />))}
      </div>
    </div>
  );
}

export default Board;
