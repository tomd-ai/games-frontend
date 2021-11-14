import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";





function WordGridSetup() {

    // random letter
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userNameError, setUserNameError] = useState(false)
    
    const history = useHistory();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerList, setPlayerList] = useLocalStorage('playerList', [])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerData, setPlayerData] = useLocalStorage('playerData', {})

    let [gameID, setGameID] = useLocalStorage('gameID', '')
    let [userName, setUserName] = useLocalStorage('userName', '')
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID', '')
    let [userID, setUserID] = useLocalStorage('userID', '')
    let [returning, setReturning] = useLocalStorage('returning', false)
    

    useEffect(()=>{
        // reset any local storage stuff to defaults
        setGameID("")
        setUserName("")
        setPlayerData({})
        setGameSessionID("")
        setUserID("")
        setReturning(false)
        setPlayerList([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleUserNameChange(event:any){
        
        setUserName(event.target.value)
        
        var newUserID = userID ? userID : uuidv4()
        var newGameSessionID = gameSessionID ? gameSessionID : uuidv4()
        var newGameID =  gameID ? gameID : (Math.floor(Math.random() * 1000000) + 100000).toString()
        var newReturning = returning ? returning : false

        setGameID(newGameID)
        setGameSessionID(newGameSessionID)
        setReturning(newReturning)
        setUserID(newUserID)
        setPlayerList([{
            userID,
            userName : event.target.value,
            "gameLeader" : true
        }])

        setPlayerData({
            userID,
            userName: event.target.value,
            "gameLeader" : true
        }
        )

    }
    const handleKeyPress = (e:any) => {
        if (e.key === "Enter"){
            handleUserNameChange(e)
        }
    }

    function startGame(event:any){
        
        
            // check that the player has at least one category
        setUserNameError(!userName)

        // check that the player has added a username
        if (!userName){
            return
        }
        else {
            history.push(
                {
                    "pathname" : '/wordGrid-waiting-room',
                }
            )

        }

    }

    return (
    <div className="project">
        <p>A multiplayer game - find words in the grid:</p>
        <ol>
            <li>The word has to be made up of letters that are next to each other.</li>
            <li>In each word, a letter on the board can only be used once.</li>
        </ol>
        <p>User name</p>
        <input 
            type="text" 
            id="username" 
            placeholder="Add username" 
            onChange={(e)=>{handleUserNameChange(e)}} 
            value={userName}
            onKeyPress={handleKeyPress}
        />
        <button className="start-game" onClick={(e)=>{startGame(e)}}>Start Game</button>

    </div>
  );
}

export default WordGridSetup;