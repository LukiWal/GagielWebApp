import React from 'react';
import './card.scss';


const CardNormal = ({card}) => {
    let cardNumber = card.split(":").pop().split('_')[1];
    let cardColor = card.split(":").pop().split('_')[0];

    let cardColorUrl = "";

    switch(cardColor) {
      case "H":
        cardColorUrl = "/hearth.svg"
        break;
      case "B":
        cardColorUrl = "/hearth.svg"
        break;
      case "S":
        cardColorUrl = "/hearth.svg"
        break;
      case "E":
        cardColorUrl = "/hearth.svg"
        break;
      default:
        cardColorUrl = "/hearth.svg"
    }
    return <div className="card"> 
        <button onClick={() => {}}> Play Card {card} </button>
        <img class="symbol symbol-top" src={cardColorUrl}></img>
        <img class="symbol symbol-bottom" src={cardColorUrl}></img>
        <h3 class="number number-top">{cardNumber}</h3>
        <h3 class="number number-bottom">{cardNumber}</h3>
    </div>;
  };
  
export default CardNormal;