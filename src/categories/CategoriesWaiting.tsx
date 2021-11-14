
import {useState, useContext, useEffect, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import useLocalStorage from "../hooks/useLocalStorage";
import {SocketContext}  from '../context/socket2'
import internal from 'stream';

type Player = {
    userName: string,
    userID: string,
    gameLeader?: boolean,
    gamesWon?: number,
    totalPoints?: number
}


function CategoriesWaiting(props:any) {
    
    const categoriesSocket = useContext(SocketContext)
    const [copySuccess, setCopySuccess] = useState('');
    const history = useHistory();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameID, setGameID] = useLocalStorage('gameID')
    let [gameData, setGameData] = useLocalStorage('gameData')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerData, setPlayerData] = useLocalStorage('playerData')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID')
    let [playerList, setPlayerList] = useLocalStorage('playerList')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [joined, setJoined] = useState(false);

    const baseJoinLink = ["localhost", "127.0.0.1", ""].includes(window.location.hostname) ? "http://localhost:3000" : "https://tomd-ai.github.io"
    const joinLink = `${baseJoinLink}/games-frontend#/join-categories/${gameID}`


    const handleJoinedRoom = useCallback(()=>{
        setJoined(true)
        console.log(true)
    }, [])

    const handleNewPlayer = useCallback( (data:any) =>{
        setPlayerList(data['playerList'])
        setGameData(data["gameData"])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleStartGame = useCallback((data:any)=>{
        history.push(
            {
                "pathname" : '/categories-game-room'
            }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSendStart = useCallback(()=>{
        console.log("START!")
        categoriesSocket.emit("send-start", {gameID})
        categoriesSocket.emit("start-timer", {gameID})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=>{
        
        categoriesSocket.on('connect',
            () => {
                console.log("connected categories")
            }
        );

        if (gameID){
            console.log("joining room")

            categoriesSocket.emit("join", {
                gameID,
                playerData,
                gameSessionID,
                gameData
            })
        }

        categoriesSocket.on("joined-room", handleJoinedRoom)
        categoriesSocket.on("new-player",handleNewPlayer);
        categoriesSocket.on("start-game", handleStartGame)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            categoriesSocket.off("joined-room", handleJoinedRoom);
            categoriesSocket.off("new-player", handleNewPlayer);
            categoriesSocket.off("start-game", handleStartGame);
          };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesSocket, handleJoinedRoom, handleNewPlayer, handleStartGame])
    

    // direct link 
    function linkToClipboard(e:any){
        navigator.clipboard.writeText(joinLink)
        e.target.focus();
        setCopySuccess('Copied!');
    }


    function refreshPage(){
        window.location.reload()
    }
    
    return (
    <div className="project">
        <h1>Categories</h1>
        <h4>Waiting room</h4>

        <p>A multiplayer game - find a word that starts with the following letter for each category!</p>
        
        {/* <p>Your game id is: <span className="gameID">{gameID}</span></p> */}
        <input readOnly value={joinLink} />
        <button onClick={(e)=>{linkToClipboard(e)}}>Copy invite link</button>
        <p>{copySuccess}</p>

        <table className="waitingTable" style={{"borderCollapse": "collapse"}}>
        <thead>
            <th>
                Player
            </th>
            <th>
                Games won
            </th>
            <th>
                Total score
            </th>
        </thead>
        <tbody>
            {
                playerList.map(
                        (player: Player, ind: number ) => {
                            return (
                            <tr key={player.userID}>
                                <td>
                                    {player.userName} {player.gameLeader ?  " (Game leader)" : "" }
                                </td>
                                {
                                    player.gamesWon ?
                                    <td>
                                        {player.gamesWon} 
                                    </td>: <td>0</td>
                                    }
                                    {
                                    player.totalPoints ?
                                    <td>
                                        {player.totalPoints}
                                    </td> : <td>0</td>
                                    }
                            </tr>
                            )
                        }
                    )
            }
        </tbody>
        </table>
        { 
            playerList.length === 0 ? <> Can't see any other players? <button onClick={()=>{refreshPage()}}>Refresh</button>  </>: <></> 
        }
        { playerData.gameLeader && <div> 
        <p>All players ready?</p>
            <button className="start-game" onClick={()=>{handleSendStart()}}>Start Game</button>
        </div>
        }

    </div>
  );
}

export default CategoriesWaiting;