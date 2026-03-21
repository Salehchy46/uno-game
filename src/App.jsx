import React, { useState, useEffect } from 'react';
import socket from '../src/socket';
import Lobby from '../src/components/Lobby';
import Game from '../src/components/Game';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    socket.on('gameState', (state) => {
      setGameStarted(state.gameStarted);
      setPlayers(state.players);
    });

    socket.on('connect', () => {
      setPlayerId(socket.id);
    });

    return () => {
      socket.off('gameState');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      {!gameStarted ? (
        <Lobby players={players} playerId={playerId} />
      ) : (
        <Game />
      )}
    </div>
  );
}

export default App;