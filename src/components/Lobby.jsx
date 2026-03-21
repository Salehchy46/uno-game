import React, { useState } from 'react';
import socket from '../socket';

function Lobby({ players, playerId }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const joinGame = () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    socket.emit('joinGame', { name });
  };

  const startGame = () => {
    if (players.length < 2) {
      setError('Need at least 2 players to start');
      return;
    }
    socket.emit('startGame');
  };

  const currentPlayer = players.find(p => p.id === playerId);
  const maxPlayers = 10; // max allowed

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">UNO Game</h1>
        
        {!currentPlayer ? (
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={joinGame}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Join Game
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Players in Lobby ({players.length}/{maxPlayers})</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {players.map((player, idx) => (
                  <div key={player.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span>{player.name}</span>
                    {player.id === playerId && <span className="text-blue-500 text-sm">(You)</span>}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Only the first player can start the game (host) */}
            {currentPlayer.id === players[0]?.id && (
              <button
                onClick={startGame}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Start Game
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lobby;