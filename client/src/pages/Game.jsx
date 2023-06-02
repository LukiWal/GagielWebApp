import React from 'react';
import { useEffect, useState } from "react";
import { socket } from '../helper/socket';
import { useParams } from "react-router-dom";
import Card from '../components/Card';
import CardNormal from '../components/CardNormal'
import Player from '../components/Player';
import './game.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrumpCard from '../components/TrumpCard';



const Game = ({sessionId}) => {
    
    let params = useParams();

    const [playerCards, setPlayerCards] = useState([]);
    const [playerPoints, setPlayerPoints] = useState(0);
    const [currentCards, setCurrentCards] = useState([]);
    const [trumpCard, setTrumpCard] = useState("");
    const [playersTurn, setPlayersTurn] = useState(null);

    const [cardHeight, setCardHeight] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);

    const [normalCardHeight, setNormalCardHeight] = useState(0);
    const [normalCardWidth, setNormalCardWidth] = useState(0);

    const [playerArray, setPlayerArray] = useState([0]);
    const [enemyPoints, setEnemyPoints] = useState([0,0,0]);

    const [gameHasStarted, setGameHasStarted] = useState(false);



    const startGame = () => {
        socket.emit("start_game", { gameId: params.roomId});
    };

    const meldCard = (card) => {
        socket.emit("meld_card", { card, gameId: params.roomId, sessionId: sessionId});
    };

    const exchangeTrump = () =>{
        socket.emit("exchange_trump", {gameId: params.roomId, sessionId: sessionId});
    }

    

    useEffect(() => {
        console.log("JOIN ROOM")
    
        if(sessionId){
            console.log("SessionId: " +sessionId)
            
            socket.emit("join_room", { gameId: params.roomId, sessionId: sessionId}, function(){
                /* socket.emit("load_game", { gameId: params.roomId }) */
            }); 
        } 
    },[] );
    
    useEffect(() => {
        function notify (message) {
            toast(message);
        }

        function startGameData(data){
            if(data.playerCards) setPlayerCards(data.playerCards);
            if(data.playerPoints) setPlayerPoints(data.playerPoints);
            if(data.trumpCard) setTrumpCard(data.trumpCard);
            if(data.playersTurn) setPlayersTurn(data.playersTurn);
            if(data.currentCards) setCurrentCards(data.currentCards);
            if(data.playerArray) setPlayerArray(data.playerArray)
            if(data.hasStarted) setGameHasStarted(data.hasStarted)
        }
    
        socket.on("error_popup", notify);
        socket.on("load_start_game", startGameData);

        return () => {
            socket.off('error_popup', notify);
            socket.off("load_start_game", startGameData);
        }
    }, []);

  
    const cardPlayedEmit = (card) => {
        socket.emit("play_card", {gameId: params.roomId, sessionId: sessionId, card: card}, function(){
            setPlayersTurn(false) 
        });
    
    }

    let listItems = null;
    

    if(playerCards.length > 0){
        var playerCardsVar = playerCards
        listItems = playerCardsVar.map((card) => <Card key={card} width={cardWidth} height={cardHeight} card={card} cardPlayedEmit={cardPlayedEmit}></Card>);
    } 
    
    let currentCardsList = null;

    if(currentCards.length > 0){
        var currentCardsVar = currentCards;
        console.log(currentCards)
        currentCardsList = currentCardsVar.map((card) => <CardNormal width={normalCardWidth} height={normalCardHeight} key={card} card={card}></CardNormal>);
    } 

    
    const size = useWindowSize();

    function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
        useEffect(() => {
          function handleResize() {
           
            setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
            });
          }
         
          window.addEventListener("resize", handleResize);
      
          handleResize();
      
          return () => window.removeEventListener("resize", handleResize);
        }, []); 
        return windowSize;
    }

    useEffect(() => {
        const ASPECT_RATIO = 1.6;
        let maxWidthCard = size.width * 0.95 * 0.9 * (1 / playerCards.length);
        let maxHeightCard = size.height * 0.3 * 0.95;

        let width = maxWidthCard;
        let height = maxWidthCard * ASPECT_RATIO;

        if(height>maxHeightCard){
            width = maxHeightCard / ASPECT_RATIO;
            height = maxHeightCard;
        }
        
        setCardWidth(width);
        setCardHeight(height);   
    },[size, playerCards] );

    useEffect(() => {
        const ASPECT_RATIO = 1.6;
        let maxWidthCard = size.width * 0.95 * 0.9 * (1 / playerArray.length);
        let maxHeightCard = size.height * 0.3 * 0.95;

        let width = maxWidthCard;
        let height = maxWidthCard * ASPECT_RATIO;

        if(height>maxHeightCard){
            width = maxHeightCard / ASPECT_RATIO;
            height = maxHeightCard;
        }
        
        setNormalCardWidth(width);
        setNormalCardHeight(height);   
    },[size]);

    return  <div className='playground'>
{               /* <h1>Game {params.roomId} </h1>
                <h2>Session ID: {sessionId}</h2> */}
          
              
                          
                
               <div className="gameControllsWrapper">

               </div>
               
                <div className={"otherPlayersWrapper " + (playerArray.length >= 3 && 'morePlayers')}>
                    {playerArray.length >= 3 &&
                        <Player points={20} imageId={1} playersTurn={playerArray[2] == playersTurn} />
                    }
                   
                    <TrumpCard key={trumpCard} card={trumpCard}></TrumpCard>
                    {playerArray.length >= 4 &&
                     <Player points={20} imageId={1} playersTurn={playerArray[3] == playersTurn} />
                    }
                </div>
                <div className='currentCardsWrapper'>
                    <div className="currentCards">
                        {currentCardsList}
                    </div>
                </div>
                <div className="secondPlayerWrapper">
                    {playerArray.length >= 2 &&
                     <Player points={20} imageId={1} playersTurn={(playerArray[1] == playersTurn) && true} />
                    }
                </div>
                <div className="playerControllsWrapper">
                    <h3 className="playerPoints">{playerPoints}</h3>
                    <h3 className={"yourTurnText " +(playerArray[0] == playersTurn && 'showYourTurnText')} >Your Turn</h3>
                    <button className={"gaigelButton " +(gameHasStarted && 'hideButton')} onClick={() => {startGame()}}> Start Game</button>
                    <button className="gaigelButton exchangeTrumpButton"onClick={() => {exchangeTrump()}}> <span>&#10227;</span>  </button>
                </div>           
                <div className='playerCardsWrapper'>
                    <div className="playerCards"> 
                        {listItems}
                    </div>
                </div>
                
               

                <ToastContainer 
                position="top-center"
                autoClose={2000}
                />
            </div>;
};
  
export default Game;