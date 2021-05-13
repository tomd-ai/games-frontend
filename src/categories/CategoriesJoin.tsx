
import React, {useState, useRef, useContext} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import WebsocketProvider, {WebSocketContext} from "../WebSocket";
import {Provider, useSelector, useDispatch} from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";

type Player = {
    userName : string,
    userID : string,
    gameLeader? : boolean
}


function CategoriesJoin(props:any) {

    const history = useHistory();
    
    const [userNameError, setUserNameError] = useState(false)

    let [gameID, setGameID] = useLocalStorage("gameID", '')
    let [userName, setUserName] = useLocalStorage("userName", '')
    let [userID, setUserID] = useLocalStorage("userID", '')
    let [returning, setReturning] = useLocalStorage("returning", '')
    let [playerData, setPlayerData] = useLocalStorage("playerData", {})
    let [playerList, setPlayerList] = useLocalStorage("playerList", [])
    
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
                "pathname" : '/categories-waiting-room'
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

export default CategoriesJoin;