import GameItem from "./GameItem";
import allGames from "../gamedata";

type game = {
    id : string,
    name : string,
    biline: string,
    url: string
}

function GamesList() {
    return <div className="blog-list">
        <div className="about-message">
          <p>Click an option below to start a game!</p>
        </div>
        { 
            allGames.map(
                (game: game) => {
                    return <GameItem id={game.id} name={game.name} biline={game.biline} url={game.url} />
                }
            )
        }

      </div>
    
  }
  
  export default GamesList;