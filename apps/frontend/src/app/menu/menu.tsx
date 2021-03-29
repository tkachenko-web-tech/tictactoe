import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';

import './menu.module.css';
import { BACKEND_PORT, HOST_ADDRESS } from '@tictactoe/config';

export function Menu() {

  const cookies = new Cookies();
  const [isPlaying, setIsPlaying] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let id = cookies.get('playerId');
    if (!id) {
      id = uuid();
      cookies.set('playerId', id);
    }
    fetch(`${HOST_ADDRESS}:${BACKEND_PORT}/player/${id}/isplaying`).then(res => res.json()).then(res => {
      setIsPlaying(res.isPlaying);
    })
  }, [])

  function createGame() {
    let id = cookies.get('playerId');
    fetch(`${HOST_ADDRESS}:${BACKEND_PORT}/player/${id}/game`, { method: 'POST' }).then(res => res.json()).then(res => {
      if (res) {
        history.push(`/game/${res.id}`);
      }
    })
  }

  function continueGame() {
    let id = cookies.get('playerId');
    fetch(`${HOST_ADDRESS}:${BACKEND_PORT}/player/${id}/game`, { method: 'GET' }).then(res => res.json()).then(res => {
      if (res) {
        history.push(`/game/${res.id}`);
      }
    })
  }

  function ContinueGameButton(props) {
    if (props.isPlaying)
      return <button onClick={continueGame}>Продолжить игру</button>
    return null;
  }

  return (
    <div className='menu'>
      <button onClick={createGame}>Создать игру</button>
      <ContinueGameButton isPlaying={isPlaying} />
    </div>
  );
}

export default Menu;
