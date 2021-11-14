import GameItem from "./GameItem";
import allGames from "../models/gamedata.json";

interface game {
    gameID: string,
    name: string,
    biline: string,
    url: string
}

function GamesList() {

    return <div className="game-list">
        <div className="about-message">
          <p>Click an option below to start a game!</p>
        </div>
        { 
            allGames.map(
                (game:game) => {
                    return <GameItem gameID={game.gameID} name={game.name} biline={game.biline} url={game.url} />
                }
            )
        }

      </div>
    
  }
  
  export default GamesList;