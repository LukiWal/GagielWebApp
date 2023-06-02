import React from 'react';
import './trumpCard.scss';


const TrumpCard = ({card}) => {
    let cardNumber = card.split(":").pop().split('_')[1];
    let cardColor = card.split(":").pop().split('_')[0];

    let cardColorUrl = "";

    switch(cardColor) {
      case "H":
        cardColorUrl = "/herz.svg"
        break;
      case "B":
        cardColorUrl = "/gras.svg"
        break;
      case "S":
        cardColorUrl = "/schellen.svg"
        break;
      case "E":
        cardColorUrl = "/eichel.svg"
        break;
      default:
        cardColorUrl = "/hearth.svg"
    }
    return <div className="trumpCard"> 
        <h3>Trumpf</h3>
        <div class="currentTrumpCard">
            <img class="trumpSymbol" src={cardColorUrl}></img>
            <h3>{cardNumber}</h3>
        </div>
    </div>;
  };
  
export default TrumpCard;