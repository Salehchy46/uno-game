import React, { useState, useEffect } from 'react';
import socket from './socket';                 // fixed path
import Lobby from './components/Lobby';       // fixed path
import Game from './components/Game';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [lobbyName, setLobbyName] = useState('');

  useEffect(() => {
    socket.on('gameState', (state) => {
      setGameStarted(state.gameStarted);
      setPlayers(state.players);
      setLobbyName(state.lobbyName || '');
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
        <Lobby players={players} playerId={playerId} lobbyName={lobbyName} />
      ) : (
        <Game />
      )}
    </div>
  );
}

export default App;