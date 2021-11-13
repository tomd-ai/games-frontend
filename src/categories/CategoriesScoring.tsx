import {useState, useContext, useCallback, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import useLocalStorage from "../hooks/useLocalStorage";
import {SocketContext}  from '../context/socket2'



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


function CategoriesScoring(props:any) {

    
    const history = useHistory();
    const categoriesSocket = useContext(SocketContext);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameID, setGameID] = useLocalStorage('gameID')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameData, setGameData] = useLocalStorage('gameData')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerData, setPlayerData] = useLocalStorage('playerData')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID')
    let [returning, setReturning] = useLocalStorage('returning')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [categories, setCategories] = useState(gameData["categories"])
    let [allAnswers , setAllAnswers] = useState<AnswerList[]>([]); //useState([])
    
    let [userScores, setUserScores] = useState<any[]>([]); 
    let [markedRows, setMarkedRows] = useState<string[]>([]); 

    const handleAnswerTable = useCallback( (data:any) => {
        setAllAnswers(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUpdateScore = useCallback((data:any)=>{
        setMarkedRows(data["rowIds"])
        setUserScores(data["userScores"])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleMark = useCallback((rowInd : number, colInd: number, rowId : string)=>{
        categoriesSocket.emit("mark-answer", {
            gameID,
            rowId,
            colInd,
            rowInd
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleStartNewGame = useCallback( () => {
        // so the game leader can make any updates they want
        categoriesSocket.emit("request-new-game", {
            gameID
        })
        console.log(returning)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        returning = setReturning(true)
        history.push(
            {
                "pathname" : '/categories',
            }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNewGameRequested = useCallback( ()=> {
        // to return players to the waiting room

        setReturning(true)

        history.push(
            {
                "pathname" : "/categories-waiting-room"
            }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=>{

        console.log(allAnswers)
        
        if (allAnswers.length === 0){
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesSocket, handleAnswerTable, handleUpdateScore, handleNewGameRequested])


    useEffect(() => {
        console.log(allAnswers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                    // eslint-disable-next-line array-callback-return
                                    userScores.map((userScore:any)=>{
                                        if (userScore["userID"] === user["userID"]){
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