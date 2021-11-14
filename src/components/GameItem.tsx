import {Link} from 'react-router-dom';

type gameData = {
    gameID : string,
    name : string,
    url: string,
    biline: string
}


function GameItem(gameData: gameData) {
    return (
    <Link to={gameData.gameID}>
      <div className="game-item">
          
              <p>
                  {gameData.name}
              </p>
              <p style={{fontSize:"24px"}}>
                  {gameData.biline}
              </p>
      </div>
    </Link>
    );
  }
  
  export default GameItem;