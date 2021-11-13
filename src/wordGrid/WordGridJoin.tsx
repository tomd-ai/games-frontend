import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";


function WordGridJoin(props:any) {

    const history = useHistory();
    
    const [userNameError, setUserNameError] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameID, setGameID] = useLocalStorage("gameID", '')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameData, setGameData] = useLocalStorage("gameData", {})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameSessionID, setGameSessionID] = useLocalStorage("gameSessionID", "")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerData, setPlayerData] = useLocalStorage("playerData", {})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerList, setPlayerList] = useLocalStorage("playerList", [])
    let [returning, setReturning] = useLocalStorage("returning", '')
    let [userName, setUserName] = useLocalStorage("userName", '')
    let [userID, setUserID] = useLocalStorage("userID", '')
    
    useEffect(()=>{
        // reset any local storage stuff to defaults
        setGameID("")
        setUserName("")
        setGameData({})
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
        var newReturning = returning ? returning : false
        var gameIDPath = props.location["pathname"].split("/").reverse()[0]

        setGameID(gameIDPath)
        setReturning(newReturning)
        setUserID(newUserID)
        
        setPlayerList([{
            userID,
            userName:event.target.value
        }])

        setPlayerData({
            userID,
            userName: event.target.value
        }
        )
    }

    function joinGameRoom(){
        setUserNameError(!userName)
        // check that the player has added a username
        if (!userName){
            return
        }
        
        history.push(
            {
                "pathname" : '/wordGrid-waiting-room'
            }
        )
    }
    
    return (
    <div className="project">
        <h1>Join game</h1>

        <p>Enter a username:</p>
        <input 
            type="text" 
            id="username" 
            placeholder="Add username" 
            onChange={(e)=>{handleUserNameChange(e)}} 
            value={userName} 
        />
        <p className={ userNameError ? "showError" : "hideError" }>Please enter a username before continuing.</p>
        <br/>
        <button onClick={()=>joinGameRoom()}>Join game</button>
        
    </div>
  );
}

export default WordGridJoin;