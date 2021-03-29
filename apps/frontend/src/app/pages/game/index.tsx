import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../header/header';
import Board from '../../board/board';

export function GamePage() {

  const { gameId }: any = useParams();

  return (
    <div className='app'>
      <Header />
      <Board gameId={gameId} />
    </div>
  );

}
