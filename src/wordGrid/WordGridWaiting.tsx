
import {useState, useContext, useEffect, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import useLocalStorage from "../hooks/useLocalStorage";
import {wordGridSocketContext}  from '../context/socket2'
import {clearWordGridEnteredWords} from "../actions/actions"
import {useSelector, useDispatch} from "react-redux";
import {setWordGridGameData} from "../actions/actions";

type Player = {
    userName : string,
    userID : string,
    gameLeader? : boolean,
    gamesWon?: number,
    totalPoints?: number
}

function WordGridWaiting(props:any) {
    
    const wordGridSocket = useContext(wordGridSocketContext)
    const [copySuccess, setCopySuccess] = useState('');
    const history = useHistory();
    const dispatch = useDispatch();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameID, setGameID] = useLocalStorage('gameID')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerData, setPlayerData] = useLocalStorage('playerData')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [joined, setJoined] = useState(false);
    
    let gameData = useSelector((s:any) => s.wordGridGameData)
    let [playerList, setPlayerList] = useLocalStorage('playerList')

    // TODO: dump this so the build process works

    const handleJoinedRoom = useCallback(()=>{
        setJoined(true)
    }, [])

    const handleNewPlayer = useCallback( (data:any) =>{
        setPlayerList(data['playerList'])
        dispatch(setWordGridGameData(data["gameData"]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleStartGame = useCallback((data:any)=>{
        history.push(
            {
                "pathname" : '/wordGrid-game-room'
            }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSendStart = useCallback(()=>{
        console.log("START!")
        wordGridSocket.emit("send-start", {gameID})
        wordGridSocket.emit("start-timer", {gameID})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleBootedPlayer = useCallback( (data:any) =>{
        setPlayerList(data['playerList'])
        if (playerData["userID"] === data["bootPlayerID"]){
            history.push(
                {
                    "pathname" : '/wordGrid'
                }
            )
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=>{
        
        wordGridSocket.on('connect',
            () => {
                console.log("connected wordGrid")
            }
        );

        if (gameID){
            console.log("joining room")

            wordGridSocket.emit("join", {
                gameID,
                playerData,
                gameSessionID,
                gameData
            })
        }

        wordGridSocket.on("joined-room", handleJoinedRoom)
        wordGridSocket.on("new-player",handleNewPlayer);
        wordGridSocket.on("start-game", handleStartGame)
        wordGridSocket.on("booted-player", handleBootedPlayer)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            wordGridSocket.off("joined-room", handleJoinedRoom);
            wordGridSocket.off("new-player", handleNewPlayer);
            wordGridSocket.off("start-game", handleStartGame);
            wordGridSocket.off("booted-player", handleBootedPlayer)
          };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wordGridSocket, handleJoinedRoom, handleNewPlayer, handleStartGame, handleBootedPlayer])
    

    // direct link 
    function linkToClipboard(e:any){
        
        let baseJoinLink = ["localhost", "127.0.0.1", ""].includes(window.location.hostname) ? "http://localhost:3000" : "https://tomd-ai.github.io"

        navigator.clipboard.writeText(`${baseJoinLink}/games-frontend#/join-wordGrid/${gameID}`)
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        e.target.focus();
        setCopySuccess('Copied!');
    }


    function refreshPage(){
        window.location.reload()
    }

    // console.log("words pre clearing")
    // console.log(enteredWords)
    dispatch(clearWordGridEnteredWords())
    // console.log(enteredWords)
    // console.log("words post clearing")
    
    const handleBootPlayer = useCallback((bootPlayerID: string)=>{
        console.log("START!")
        wordGridSocket.emit("boot-player", {
            gameID,
            bootPlayerID
        }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
    <div className="project">
        <h1>WordGrid</h1>
        <h4>Waiting room</h4>

        <p>Rules</p>
        <ol>
            <li>The word has to be made up of letters that are next to each other.</li>
            <li>In each word, a letter on the board can only be used once.</li>
            <li>Words must be at least 4 letters long.</li>
        </ol>

        <p>Your game id is: <span className="gameID">{gameID}</span></p>
        <button onClick={(e)=>{linkToClipboard(e)}}>Click to copy direct link</button>
        <p>{copySuccess}</p>

        <p>Current players:</p>
        <table className="wordGridTable" style={{"borderCollapse": "collapse"}}>
        <thead>
            <tr>
                <th>
                    Player
                </th>
                <th> Games won </th>
                <th> Total points </th>
            </tr>
        </thead>
        <tbody>
            {
                playerList.map(
                        (player: Player, ind: number ) => {
                            return (
                            <tr key={player.userID}>
                                <td>
                                    {player.userName}
                                    {player.gameLeader ?  " (Game leader)" : "" }
                                    <br/>
                                    {
                                        
                                        playerData.gameLeader ? 
                                            player.gameLeader ? <></> : <button onClick={()=> handleBootPlayer(player.userID)}>Boot</button>
                                        : ""
                                    
                                    }
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
        <p>Ready?</p>
            <button className="start-game" onClick={()=>{handleSendStart()}}>Start Game</button>
        </div>
        }

    </div>
  );
}

export default WordGridWaiting;