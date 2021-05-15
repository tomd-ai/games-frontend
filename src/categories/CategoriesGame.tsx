import React, {useState, useRef, useContext, useCallback, useEffect} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Provider, useSelector, useDispatch} from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";
import Category from "../models";
import {SocketContext}  from '../context/socket2'

type Player = {
    userName : string,
    userID : string,
    gameLeader? : boolean
}

type Answers = [
    {
        key : string,
        name: string,
        answer? :string
    }
]

function CategoriesGame(props:any) {

    
    const history = useHistory();
    const categoriesSocket = useContext(SocketContext);
    
    let [gameID, setGameID] = useLocalStorage('gameID')
    let [userName, setUserName] = useLocalStorage('userName')
    let [gameData, setGameData] = useLocalStorage('gameData')
    let [playerData, setPlayerData] = useLocalStorage('playerData')
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID')
    let [userID, setUserID] = useLocalStorage('userID')
    let [returning, setReturning] = useLocalStorage('returning')
    let [playerList, setPlayerList] = useLocalStorage('playerList')

    let [minutes, setMinutes] = useState("")
    let [seconds, setSeconds] = useState("")
    
    let [answers, setAnswers] = useState(gameData["categories"])
    let [gameLetter, setGameLetter] = useState(gameData["gameLetter"])
    let [stopBus, setBus] = useState(false)

    // const getGameLetter = () => {
    //     setGameLetter(gameData["gameLetter"])
    //     return gameLetter
    // }

    const handleChange = (e:any) =>{

        let newAnswers: Answers[] =[]
        let numAnswers = 0
        
        newAnswers = answers.map( (ans:any) =>{
            if (e.target.id == ans.key){
                ans["answer"] = e.target.value
                
                numAnswers += ans["answer"] && ans["answer"].charAt(0).toLowerCase() === gameLetter.toLowerCase() ? 1 : 0
            }else{
                if (ans["answer"]){

                    numAnswers += ans["answer"] && ans["answer"].charAt(0).toLowerCase() === gameLetter.toLowerCase() ? 1 : 0
                }
            }
            return ans
        })

        if (numAnswers == answers.length){
            setBus(true)
        }else{
            setBus(false)
        }
        setAnswers(newAnswers)
    }


    const handleStopBus = useCallback(()=>{
        console.log(" handle send answers")
        setBus(true)
        categoriesSocket.emit("send-answers", {
            gameID,
            userID,
            userName,
            answers,
            "stopBus" : true
        })
        history.push(
            {
                "pathname" : '/categories-scoring',
            }
        )
    }, [])

    const handleTimerTick = useCallback((data: any)=>{
        
        setMinutes(data["minutes"])
        setSeconds(data["seconds"])
        
        if ( data["minutes"] == 0 && data["seconds"] == 0 ){
            handleForceEndGame()
        }
    
    }, [])

    const handleForceEndGame = useCallback(()=>{
        
        categoriesSocket.emit("send-answers", {
            gameID,
            userID,
            userName,
            answers,
            stopBus : false
        })
        history.push(
            {
                "pathname" : '/categories-scoring',
            }
        )
    }, [])

    
    useEffect( ()=>{

        categoriesSocket.on("send-answers", handleForceEndGame);
        categoriesSocket.on("timer-tick", handleTimerTick);
        categoriesSocket.on("end-game", handleForceEndGame)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            categoriesSocket.off("send-answers", handleForceEndGame);
            categoriesSocket.off("timer-tick", handleTimerTick);
            categoriesSocket.off("end-game", handleForceEndGame)
          };

    }, [categoriesSocket, handleForceEndGame, handleTimerTick])



    
    return (
    <div className="project">
        <h1>Let's play</h1>        
        <p>Time left: {minutes ? minutes.toString() + " minute" : "" } { seconds ? seconds.toString() + " seconds" : "Game ended"}</p>
        <p>Enter something for each category that starts with:</p>
        <p><span className="gameLetter" style={{fontSize: "55px"}}>{gameLetter}</span></p>

        <table style={{paddingBottom: "20px"}}>
        <tr>
            <th>Category</th>
            <th>Answer</th>
            <th>{/* Error */}</th>
        </tr>
        {answers.map(
                (category: Category) => {
                    return (
                    <tr>
                        <td>{category.name}</td>
                        <td>
                            <input
                                type="text" 
                                id={category.key} 
                                defaultValue={ category["answer"] ? category["answer"] : '' }
                                onChange={(e)=>handleChange(e)}
                            />
                        </td>
                        <td>
                            <p className={ category["answer"] && category["answer"].charAt(0).toLowerCase() !== gameLetter.toLowerCase() ? "showError" : "hideError" }>Category has to start with {gameLetter}!</p>
                        </td>
                    </tr>
                    )
                }
            )
        }
        <tr>
            <td>
            </td>
            <td>
            { stopBus ? <button id="stop" onClick={()=>handleStopBus()}>Stop!</button> : <></>}
            </td>
            <td>
            </td>
        </tr>
        </table>

        
    </div>
  );
}

export default CategoriesGame;