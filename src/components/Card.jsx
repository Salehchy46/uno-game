import React from 'react';

function Card({ card, onClick, disabled = false }) {
  const getCardColor = () => {
    if (card.type === 'wild') return 'bg-gray-800';
    switch (card.color) {
      case 'red': return 'bg-red-600';
      case 'green': return 'bg-green-600';
      case 'blue': return 'bg-blue-600';
      case 'yellow': return 'bg-yellow-500';
      default: return 'bg-gray-800';
    }
  };

  const getCardContent = () => {
    if (card.type === 'number') {
      return <div className="card-number">{card.value}</div>;
    }
    if (card.type === 'action') {
      const actionText = {
        skip: 'Skip',
        reverse: '↺',
        draw2: '+2'
      };
      return <div className="card-action">{actionText[card.action]}</div>;
    }
    if (card.type === 'wild') {
      return <div className="card-action">{card.action === 'wild' ? 'Wild' : 'Wild +4'}</div>;
    }
  };

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`card ${getCardColor()} text-white flex items-center justify-center ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
    >
      {getCardContent()}
    </div>
  );
}

export default Card;