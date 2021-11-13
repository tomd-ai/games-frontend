import React, {useState, useRef, useContext, useEffect, useCallback} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import useLocalStorage from "../hooks/useLocalStorage";
import {PictureSocketContext}  from '../context/socket2'
import { v4 as uuidv4 } from 'uuid';

type Player = {
    userName : string,
    userID : string,
    gameLeader? : boolean
}


function PictureGuess(props:any) {
    // context stuff
    const pictureSocket = useContext(PictureSocketContext)
    const history = useHistory();
    
    // class handlers
    let [copySuccess, setCopySuccess] = useState('');
    let [joinStatus, setJoinStatus] = useState('');
    let [startButtonStatus, setStartButtonStatus] = useState('')

    // user data
    let [userName, setUserName] = useState('')
    let [userID, setUserID] = useState(uuidv4())

    // game data in general
    let [gameID, setGameID] = useState(getGameID())
    let [playerData, setPlayerData] = useState({})
    let [playerStatus, setPlayerStatus] = useState('')
    let [playerList, setPlayerList] = useState([])
    let [gameData, setGameData] = useState({})
    
    //current game
    let [currentWord, setCurrentWord] = useState('')
    let [currentAnswers, setCurrentAnswers] = useState([])
    let [curGuess, setCurGuess] = useState('')
    let [currentPlayer, setCurrentPlayer] = useState('')
    let [isCurrentPlayer, setIsCurrentPlayer] = useState(false)
    let [nextPlayer, setNextPlayer] = useState('')
    let [isNextPlayer, setIsNextPlayer] = useState(false)


    function getGameID(){
        var gameIDPath = props.location["pathname"].split("/").reverse()[0]
        if (!gameIDPath){
            let newGameID =  (Math.floor(Math.random() * 1000000) + 100000).toString()
            return newGameID
        }else{
            return gameIDPath
        }
    }

    useEffect( () => {
        setUserName(userName)
    }, [userName])


    const handleJoinedRoom = useCallback(()=>{
        setJoinStatus('hideJoin')
        console.log(true)
    }, [])

    const handleNewPlayer = useCallback( (data:any) =>{
        setPlayerList(data['playerList'])
        setGameData(data["gameData"])
    }, [])

    // const handleStartGame = useCallback((data:any)=>{
    //     history.push(
    //         {
    //             "pathname" : '/categories-game-room'
    //         }
    //     )
    // }, [])

    // const handleSendStart = useCallback(()=>{
    //     console.log("START!")
    //     pictureSocket.emit("send-start", {gameID})
    //     pictureSocket.emit("start-timer", {gameID})
    // }, [])

    useEffect( ()=>{
        
        pictureSocket.on('connect',
            () => {
                console.log("connected picture-guess")
            }
        );

        pictureSocket.on("joined-room", handleJoinedRoom)
        pictureSocket.on("new-player",handleNewPlayer);
        // pictureSocket.on("start-game", handleStartGame)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            pictureSocket.off("joined-room", handleJoinedRoom);
            pictureSocket.off("new-player", handleNewPlayer);
            // pictureSocket.off("start-game", handleStartGame);
          };

    }, [pictureSocket])//, handleJoinedRoom, handleNewPlayer, handleStartGame])
    


    // direct link 
    function linkToClipboard(e:any){
        
        let baseJoinLink = ["localhost", "127.0.0.1", ""].includes(window.location.hostname) ? "http://localhost:3000" : "https://tomd-ai.github.io"

        navigator.clipboard.writeText(`${baseJoinLink}/games-frontend#/picture-guess/${gameID}`)
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        e.target.focus();
        setCopySuccess('Copied!');
    }

    function makeGuess(){
        
    }

    function handleGuessChange(e:any){
        setCurGuess(e.target.value)
    }

    function handleUserNameChange(e:any){
        setUserName(e.target.value)
        setPlayerData(
            {
                userID,
                userName
            }
        )
    }

    function handleJoinGame(){
        // console.log(gameID)
        // console.log(userID)
        // console.log(userName)
        // console.log(playerData)
        if (gameID && userID && userName){
            console.log("joining room")

            pictureSocket.emit("join", {
                gameID,
                playerData,
            })
        }
    }

    function newWord(){
        return 
    }



    
    return (
    <div className="project">
        <h1>Picture guess</h1>
        
        <div className="pictureGuess">
        
            <div className="leftBar">

                <div className="pictureTimer">
                    <p>Timer</p>
                    <button className={startButtonStatus}>Start</button>
                </div>

                <div className="wordData">
                    <p>word to guess: {currentWord}</p>
                    <p>Too hard?<button onClick={newWord}>New word</button></p>
                </div>
                <div className="currentTurn">
                    <p>Who's turn:</p>
                    {currentPlayer}
                    <p>Next:</p>
                    {nextPlayer}
                    <p>You are: {playerStatus}</p>
                </div>

            </div>

            <div className="drawingPanel">
                <canvas id="drawingCanvas" width="500" height="400">

                </canvas>
            </div>
            
            <div className="rightBar">
                <div className="currentPlayers">
                    <p>Game ID: {gameID} <br></br><button onClick={linkToClipboard}>copy share link</button></p>
                    <p className={joinStatus}><input onChange={(e)=>{handleUserNameChange(e)}} placeholder="join game"></input> <button onClick={handleJoinGame}>Join</button></p>
                    <p>List of players</p>
                    <ol>
                        {
                            playerList.map( (player)=>{
                                return (
                                    <li>{player["userName"]}</li>
                                )
                            })
                        }
                    </ol>
                </div>
                <div className="guesses">
                    <p>Guess list</p>
                    <input id="guessID" onChange={(e)=>{handleGuessChange(e)}}></input> <button onClick={makeGuess}>Make guess</button>
                </div>
            
            </div>
        
        </div>

    </div>
  );
}

export default PictureGuess;