import React from 'react';

const Card = ({ card, meldCard, cardPlayedEmit}) => {
    return <div> 
        <button onClick={() => {cardPlayedEmit(card)}}> Play Card {card} </button>
        <button onClick={() => {meldCard(card)}}> Karte melden</button>
    </div>;
  };
  
export default Card;