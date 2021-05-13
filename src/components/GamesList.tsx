import React from 'react';
import GameItem from "./GameItem";
import allGames from "../gamedata";

type game = {
    id : string,
    name : string
}

function GamesList() {
    return <div className="blog-list">
        <div className="about-message">
          <p>Click an option below to start a game!</p>
        </div>
        { allGames.map( (game: game) => <GameItem id={game.id} name={game.name}  />  )}
      </div>
    
  }
  
  export default GamesList;