import React, { useState, useEffect } from 'react';
import socket from '../socket';
import Card from './Card';

function Game() {
  const [hand, setHand] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingWild, setPendingWild] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('gameState', (state) => {
      setGameState(state);
    });

    socket.on('yourHand', ({ hand: newHand }) => {
      setHand(newHand);
    });

    socket.on('canPlayDrawnCard', ({ card }) => {
      if (window.confirm('You drew a playable card! Play it now?')) {
        playCard(card);
      } else {
        socket.emit('drawCard', { skipTurn: true });
      }
    });

    socket.on('error', ({ message }) => {
      setMessage(message);
      setTimeout(() => setMessage(''), 3000);
    });

    socket.on('unoCalled', ({ message }) => {
      setMessage(message);
      setTimeout(() => setMessage(''), 2000);
    });

    return () => {
      socket.off('gameState');
      socket.off('yourHand');
      socket.off('canPlayDrawnCard');
      socket.off('error');
    };
  }, []);

  const playCard = (card) => {
    if (card.type === 'wild') {
      setPendingWild(card);
      setShowColorPicker(true);
      return;
    }
    socket.emit('playCard', { card });
  };

  const selectWildColor = (color) => {
    if (pendingWild) {
      socket.emit('playCard', { card: pendingWild, chosenColor: color });
      setPendingWild(null);
      setShowColorPicker(false);
    }
  };

  const drawCard = () => {
    socket.emit('drawCard');
  };

  const callUno = () => {
    if (hand.length === 1) {
      socket.emit('callUno');
    }
  };

  if (!gameState) return <div className="text-white text-center mt-20">Loading...</div>;

  const isMyTurn = gameState.players.some(p => p.isCurrentPlayer && p.id === socket.id);
  const currentPlayerName = gameState.players.find(p => p.isCurrentPlayer)?.name || 'Unknown';

  return (
    <div className="container mx-auto px-4 py-4">
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}
      
      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Choose a color</h3>
            <div className="flex gap-4">
              {['red', 'green', 'blue', 'yellow'].map(color => (
                <button
                  key={color}
                  onClick={() => selectWildColor(color)}
                  className={`w-12 h-12 rounded-full bg-${color}-500 hover:scale-110 transition`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Game Info */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Current Turn: {currentPlayerName}</h2>
            {isMyTurn && <p className="text-green-600 font-semibold">Your turn!</p>}
          </div>
          <button
            onClick={callUno}
            disabled={hand.length !== 1}
            className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50 hover:bg-red-600 transition"
          >
            UNO!
          </button>
        </div>
      </div>
      
      {/* Players - responsive grid for up to 10 players */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {gameState.players.map((player, idx) => (
          <div
            key={player.id}
            className={`bg-white rounded-lg shadow p-3 ${player.isCurrentPlayer ? 'ring-2 ring-yellow-400' : ''}`}
          >
            <div className="font-bold truncate">{player.name} {player.id === socket.id && '(You)'}</div>
            <div>Cards: {player.handCount}</div>
          </div>
        ))}
      </div>
      
      {/* Discard Pile */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Top Card:</h3>
        <div className="flex justify-center">
          {gameState.topCard && <Card card={gameState.topCard} onClick={() => {}} />}
        </div>
      </div>
      
      {/* Your Hand */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Your Cards ({hand.length})</h3>
        {!isMyTurn && hand.length > 0 && (
          <p className="text-gray-500 mb-2">Waiting for other players...</p>
        )}
        <div className="flex flex-wrap gap-2 justify-center">
          {hand.map((card, idx) => (
            <Card
              key={idx}
              card={card}
              onClick={() => isMyTurn && playCard(card)}
              disabled={!isMyTurn}
            />
          ))}
        </div>
        
        {isMyTurn && (
          <button
            onClick={drawCard}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Draw Card
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;