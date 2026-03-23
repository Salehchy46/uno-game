import React, { useState } from 'react';
import socket from '../socket';

function Lobby({ players, playerId }) {
  const [name, setName] = useState('');
  const [lobbyName, setLobbyName] = useState('');
  const [error, setError] = useState('');

  const joinGame = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    // If this is the first player, send lobbyName
    const isFirst = players.length === 0;
    socket.emit('joinGame', {
      name,
      lobbyName: isFirst ? lobbyName : undefined
    });
  };

  const startGame = () => {
    if (players.length < 2) {
      setError('Need at least 2 players to start');
      return;
    }
    socket.emit('startGame');
  };

  const currentPlayer = players.find(p => p.id === playerId);
  const isHost = currentPlayer?.id === players[0]?.id;
  const gameStateLobbyName = players.length > 0 ? players[0]?.lobbyName : null; // if we stored lobbyName in player object? Actually we store it separately

  // You'll need to receive lobbyName from the server via gameState.
  // We'll add it to the gameState prop in App.jsx and pass it down.
  // For now, we assume a prop `lobbyName` is passed from App.

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">UNO Game</h1>

        {!currentPlayer ? (
          // Join form
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {players.length === 0 && (
              <input
                type="text"
                placeholder="Lobby name (optional)"
                value={lobbyName}
                onChange={(e) => setLobbyName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <button
              onClick={joinGame}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Join Game
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        ) : (
          // Lobby view
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                Lobby: {players[0]?.lobbyName || 'Default Lobby'}
              </h2>
              <h3 className="text-lg font-medium mb-2">Players ({players.length}/10)</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {players.map((player, idx) => (
                  <div key={player.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <div className="flex items-center gap-2">
                      <span>{player.name}</span>
                      {player.id === playerId && <span className="text-blue-500 text-sm">(You)</span>}
                      {idx === 0 && <span className="text-yellow-600 text-sm font-semibold">👑 Host</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isHost && (
              <button
                onClick={startGame}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Start Game
              </button>
            )}
            {!isHost && players.length > 0 && (
              <p className="text-center text-gray-500 text-sm mt-2">
                Waiting for host to start the game...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lobby;