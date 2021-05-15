import React, {useState, useRef, useContext, useCallback, useEffect} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Provider, useSelector, useDispatch} from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";
import Category from "../models";
import {socket, SocketContext}  from '../context/socket2'

type Player = {
    userName : string,
    userID : string,
    gameLeader? : boolean
}

type AnswerList = [
    gameID : string,
    gameSessionID : string,
    userID : string,
    userName : string,
    answers : Answers[]
]

type Answers = [
    {
        key : string,
        name: string,
        answer? :string
    }
]

type MarkedRows = [
    string[] 
]

function CategoriesScoring(props:any) {

    
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

    let [categories, setCategories] = useState(gameData["categories"])
    let [allAnswers , setAllAnswers] = useState<AnswerList[]>([]); //useState([])
    
    let [userScores, setUserScores] = useState<any[]>([]); 
    let [markedRows, setMarkedRows] = useState<string[]>([]); 

    const handleAnswerTable = useCallback( (data:any) => {
        setAllAnswers(data)
    }, [])

    const handleUpdateScore = useCallback((data:any)=>{
        setMarkedRows(data["rowIds"])
        setUserScores(data["userScores"])
    }, [])

    const handleMark = useCallback((rowInd : number, colInd: number, rowId : string)=>{
        categoriesSocket.emit("mark-answer", {
            gameID,
            rowId,
            colInd,
            rowInd
        })
    }, [])

    const handleStartNewGame = useCallback( () => {
        // so the game leader can make any updates they want
        categoriesSocket.emit("request-new-game", {
            gameID
        })
        console.log(returning)
        returning = setReturning(true)

        history.push(
            {
                "pathname" : '/categories',
            }
        )
    }, []);

    const handleNewGameRequested = useCallback( ()=> {
        // to return players to the waiting room

        setReturning(true)

        history.push(
            {
                "pathname" : "/categories-waiting-room"
            }
        )
    }, [])



    
    useEffect( ()=>{

        console.log(allAnswers)
        
        if (allAnswers.length == 0){
            console.log("doing this once")
            categoriesSocket.emit("join", {
                gameID,
                playerData,
                gameSessionID,
                gameData
            })
            categoriesSocket.emit("get-all-answers", {
                gameID
            })
        }
        
        categoriesSocket.on("get-answers", handleAnswerTable);
        categoriesSocket.on("update-scores", handleUpdateScore);
        categoriesSocket.on("start-new-game", handleNewGameRequested);

        // categoriesSocket.on("timer-tick", handleTimerTick);

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            categoriesSocket.off("get-answers", handleAnswerTable);
            categoriesSocket.off("update-scores", handleUpdateScore);
            categoriesSocket.off("start-new-game", handleNewGameRequested);
          };

    }, [categoriesSocket, handleAnswerTable, handleUpdateScore, handleNewGameRequested])


    useEffect(() => {
        console.log(allAnswers)
    }, [allAnswers])

    
    return (
    <div className="project">
        <h1>Time to score!</h1>        
        <p>The game leader will now mark the answers:</p>
        <table>
            <thead>
                <th>
                    Category
                </th>
                {
                    allAnswers.map( (user:any) => {
                        return (
                        <th>
                            { user["userName"] ? user["userName"] : 0 }
                        </th>
                        )
                    } )
                }
            </thead>
            <tbody>
                {
                    categories.map( (row: any, rowInd: any) => {
                        return (
                        <tr>
                            <td>
                                { row["name"] }
                            </td>
                            { 
                              allAnswers.map( (user:any, colInd) => {
                                  return (
                                      <td 
                                        id={ `rowIndIS${rowInd.toString()}ANDcolIndIS${colInd.toString()}` }
                                        onClick={ () => {
                                            // console.log("clicked")
                                            // console.log(playerData)
                                            if (playerData["gameLeader"]) {
                                                // console.log("clickedHandler")
                                                handleMark(colInd, rowInd, `rowIndIS${rowInd.toString()}ANDcolIndIS${colInd.toString()}`)
                                            }
                                        }
                                        }
                                        className={  markedRows.includes('rowIndIS' + rowInd.toString() + 'ANDcolIndIS' + colInd.toString() ) ? "accepted" : "" }
                                      >
                                          { user["answers"][rowInd]["answer"] }
                                      </td>
                                  )
                              } )
                            }
                        </tr>
                        )
                    } )
                }
            </tbody>
            <tfoot>
                <tr>
                    <th>
                        Score
                    </th>
                    {
                        allAnswers.map( (user:any, ind: any) => {
                            return (
                            <th>
                                { 
                                    userScores.map((userScore:any)=>{
                                        if (userScore["userID"] == user["userID"]){
                                            return userScore["score"]
                                        }
                                    })
                                }
                            </th>
                            )
                        } )
                    }
                </tr>
            </tfoot>
        </table>
        
        
        { playerData["gameLeader"] ? <div>
                <p>Play again?</p>
                <button onClick={()=>{
                    handleStartNewGame()
                }}>New game</button>
            </div> : <></>
        }

        
    </div>
  );
}

export default CategoriesScoring;