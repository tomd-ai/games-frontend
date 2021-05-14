
import React, {useState, useRef, useContext, useEffect, useCallback} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import useLocalStorage from "../hooks/useLocalStorage";
import {SocketContext}  from '../context/socket2'

type Player = {
    userName : string,
    userID : string,
    gameLeader? : boolean
}


function CategoriesWaiting(props:any) {
    
    const categoriesSocket = useContext(SocketContext)
    const [copySuccess, setCopySuccess] = useState('');
    const history = useHistory();


    let [gameID, setGameID] = useLocalStorage('gameID')
    let [userName, setUserName] = useLocalStorage('userName')
    let [gameData, setGameData] = useLocalStorage('gameData')
    let [playerData, setPlayerData] = useLocalStorage('playerData')
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID')
    let [userID, setUserID] = useLocalStorage('userID')
    let [returning, setReturning] = useLocalStorage('returning')
    let [playerList, setPlayerList] = useLocalStorage('playerList')
    let [joined, setJoined] = useState(false);

    const handleJoinedRoom = useCallback(()=>{
        setJoined(true)
        console.log(true)
    }, [])

    const handleNewPlayer = useCallback( (data:any) =>{
        setPlayerList(data['playerList'])
        setGameData(data["gameData"])
    }, [])

    const handleStartGame = useCallback((data:any)=>{
        history.push(
            {
                "pathname" : '/categories-game-room'
            }
        )
    }, [])

    const handleSendStart = useCallback(()=>{
        console.log("START!")
        categoriesSocket.emit("send-start", {gameID})
        categoriesSocket.emit("start-timer", {gameID})
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

    }, [categoriesSocket, handleJoinedRoom, handleNewPlayer, handleStartGame])
    

    // direct link 
    function linkToClipboard(e:any){
        navigator.clipboard.writeText(`http://localhost:3000/games-frontend#/join-categories/${gameID}`)
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        e.target.focus();
        setCopySuccess('Copied!');
    }


    
    
    return (
    <div className="project">
        <h1>Categories</h1>
        <h4>Waiting room</h4>

        <p>A multiplayer game - find a word that starts with the following letter for each category!</p>
        
        <p>Your game id is: <span className="gameID">{gameID}</span></p>
        <button onClick={(e)=>{linkToClipboard(e)}}>Click to copy direct link</button>
        <p>{copySuccess}</p>

        <p>Current players:</p>
        <ol>
        {
            playerList.map(
                    (player: Player ) => {
                        return (
                        <li className="player" key={player.userID}>
                        {player.userName}
                        {player.gameLeader ?  " (Game leader)" : "" }
                        </li>
                        )
                    }
                )
        }
        </ol>
        { playerData.gameLeader && <div> 
        <p>3. Click start game:</p>
            <button className="start-game" onClick={()=>{handleSendStart()}}>Start Game</button>
        </div>
        }

    </div>
  );
}

export default CategoriesWaiting;