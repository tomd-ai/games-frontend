import {useState, useRef, useContext, useCallback, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import useLocalStorage from "../hooks/useLocalStorage";
import {wordGridSocketContext}  from '../context/socket2'
import {setAllWordGridAnswers} from "../actions/actions";
import {setNewWordGridBoard} from "../actions/actions";
import {clearWordGridEnteredWords} from "../actions/actions"

type Answer = {
    word?: string
    path?: string[]
    score?: number
}

type AnswerList = [
    Answer[]
]

function WordGridScoring(props:any) {

    const dispatch = useDispatch();
    const history = useHistory();
    const wordGridSocket = useContext(wordGridSocketContext);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameID, setGameID] = useLocalStorage('gameID')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerData, setPlayerData] = useLocalStorage('playerData')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [returning, setReturning] = useLocalStorage('returning')
    
    let [counter, setCounter] = useState(0)

    let newGame = useRef(false)
    
    const newBoard = useRef({});

    const isInitialMount = useRef(true)

    let gameData = useSelector((s:any) => s.wordGridGameData)

    let [allAnswers, setAllAnswers] = useState([])
    let [allDictionaryAnswers, setAllDictionaryAnswers] = useState([])

    let [highlightedCells, setHighlightedCells] = useState<string[]>([]);
    // if (playerData.gameLeader){
    //     // newBoard.current = genNewBoard()
    // } else {
    //     // newBoard.current = {"b": 2}
    // }
    useEffect(()=>{
        
        console.log("using effect")
        console.log(newGame.current)
        
        if (newGame.current === true){
            console.log("actually using effect")
            console.log(newGame.current)
            console.log(newBoard.current)

            // setGameData(newBoard.current)

            dispatch(clearWordGridEnteredWords())
            dispatch(setNewWordGridBoard())
            setAllAnswers([])
            setAllDictionaryAnswers([])
            setReturning(true)
            newGame.current = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter])

    const handleAnswerTable = useCallback( (data:any) => {
        console.log("received answers")
        // console.log(data)

        dispatch(setAllWordGridAnswers(data))
        setCounter(counter + 1)

        setAllAnswers(data.allAnswers)
        setAllDictionaryAnswers(data.dictionaryAnswers)

        // console.log(allWordGridAnswers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // function wipeCurGameData (gameLeader:boolean) {
    //     console.log(gameLeader)
        
    // }

    function handleStartNewGame() {
        // so the game leader can make any updates they want
        
        // wipeCurGameData(playerData.gameLeader)
        newGame.current = true
        setCounter(counter + 1) // trigger page update

        console.log("new game")
        console.log(newGame)
        
        wordGridSocket.emit("request-new-game", {
            gameID,
            gameData
        })

        // history.push(
        //     {
        //         "pathname" : '/wordGrid-waiting-room',
        //     }
        // )

    }

    const handleNewGameRequested = useCallback( ()=> {
        // to return players to the waiting room

        newGame.current = true
        setCounter(counter + 1) // trigger page update

        history.push(
            {
                "pathname" : "/wordGrid-waiting-room"
            }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect( ()=>{
        
        if (isInitialMount.current){
            isInitialMount.current = false
            console.log("doing this once")
            wordGridSocket.emit("join", {
                gameID,
                playerData,
                gameSessionID,
                gameData
            })
            wordGridSocket.emit("get-all-answers", {
                gameID
            })
        }
        
        wordGridSocket.on("get-answers", handleAnswerTable);
        wordGridSocket.on("start-new-game", handleNewGameRequested);

        // categoriesSocket.on("timer-tick", handleTimerTick);

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            wordGridSocket.off("get-answers", handleAnswerTable);
            wordGridSocket.off("start-new-game", handleNewGameRequested);
          };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wordGridSocket, handleAnswerTable, handleNewGameRequested])

    const highlightCells = (path:string[]) => {
        // first get the path
        setHighlightedCells(path)
    }

    const deHighlightCells = () => {
        setHighlightedCells([])
    }

    function drawAnswers(allAnswers:any){

        var arrLengths = allAnswers.map((answer:any)=>{
            // console.log(answer)
            return answer["enteredWords"]["wordList"].length
        })

        var longestArrLen = Math.max(...arrLengths)

        // console.log(longestArrLen)

        let rowList = []

        for (let i = 0; i < longestArrLen; i++ ){
            // console.log(i)
            let row: Array<AnswerList> = []
            allAnswers.forEach((answer:any)=>{
                // console.log(answer)
                if (answer["scoredAnswers"][i]){
                    row.push(
                        answer["scoredAnswers"][i]
                    )
                }else{
                    var blankAns =  {
                        "word": "",
                        "score": -1,
                        "path": []
                    }
                    answer["scoredAnswers"][i] = blankAns
                    row.push(
                        answer["scoredAnswers"][i]
                    )
                }
            })

            rowList.push(row)
        }

        // console.log(rowList)

        return rowList.map((row: any)=>{
            return (
            <tr>
                <td style={{borderRight:"3px solid"}}></td>
                {
                    row.map((cell: any)=>{
                        return (
                                <td className={cell.score === 0 ? "seenWord" : ""} onMouseEnter={() => highlightCells(cell.path)} onMouseLeave={()=>deHighlightCells()}>
                                    {cell.word}
                                </td>
                        )
                    })
                }
            </tr>
            )
        })
    }


    return (
    <div className="project">
        <h1>Results!</h1>        

        {/* <p style={{fontSize: "10px"}}>{JSON.stringify(allAnswers)}</p> */}
        
        <table className="playerAnswers" style={{"borderCollapse": "collapse"}}>
        <thead>
            <tr>
                <td style={{borderRight:"3px solid", borderBottom: "3px solid"}}>Player</td>
                {
                    allAnswers && allAnswers.map((answerRow:any)=>{
                        return <th style={{borderBottom: "3px solid"}}>{answerRow.userName}</th>
                    })
                }
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style={{borderRight:"3px solid", borderBottom: "3px solid"}}>
                    Score
                </td>
                {
                    allAnswers && allAnswers.map((answerRow:any)=>{
                        return <th style={{borderBottom: "3px solid"}}>{answerRow.playerScore}</th>
                    })
                }
            </tr>
            {
                allAnswers && drawAnswers(allAnswers)
            }
        
        </tbody>
        </table>
        
        
        <table className="wordGridTable" style={{tableLayout: "fixed"}}>
            <thead>
            </thead>
            <tbody>
            <tr><td className={highlightedCells.includes("A1") ? "highlight" : ""}>{gameData.A1}</td><td className={highlightedCells.includes("A2") ? "highlight" : ""}>{gameData.A2}</td><td className={highlightedCells.includes("A3") ? "highlight" : ""}>{gameData.A3}</td><td className={highlightedCells.includes("A4") ? "highlight" : ""}>{gameData.A4}</td></tr>
            <tr><td className={highlightedCells.includes("B1") ? "highlight" : ""}>{gameData.B1}</td><td className={highlightedCells.includes("B2") ? "highlight" : ""}>{gameData.B2}</td><td className={highlightedCells.includes("B3") ? "highlight" : ""}>{gameData.B3}</td><td className={highlightedCells.includes("B4") ? "highlight" : ""}>{gameData.B4}</td></tr>
            <tr><td className={highlightedCells.includes("C1") ? "highlight" : ""}>{gameData.C1}</td><td className={highlightedCells.includes("C2") ? "highlight" : ""}>{gameData.C2}</td><td className={highlightedCells.includes("C3") ? "highlight" : ""}>{gameData.C3}</td><td className={highlightedCells.includes("C4") ? "highlight" : ""}>{gameData.C4}</td></tr>
            <tr><td className={highlightedCells.includes("D1") ? "highlight" : ""}>{gameData.D1}</td><td className={highlightedCells.includes("D2") ? "highlight" : ""}>{gameData.D2}</td><td className={highlightedCells.includes("D3") ? "highlight" : ""}>{gameData.D3}</td><td className={highlightedCells.includes("D4") ? "highlight" : ""}>{gameData.D4}</td></tr>
            </tbody>
        </table>
        <p style={{fontSize: "15px"}}>All words:</p>
        <table className="wordGridDictionaryTable" style={{fontSize: "10px"}}>
            <thead>
                {
                    allDictionaryAnswers && <tr>
                        <th>Word</th>
                        <th>Definition</th>
                        <th>Score</th>
                        </tr>
                }
            </thead>
            <tbody>
            {
            allDictionaryAnswers && allDictionaryAnswers.map(
                (word:any)=>{
                return <tr onMouseEnter={() => highlightCells(word.path)} onMouseLeave={()=>deHighlightCells()}>
                    <td>
                        {word.word}
                    </td>
                    <td>
                        {word.definition}
                    </td>
                    <td>
                        {word.score}
                    </td>
                </tr>
            })
            }
            </tbody>
        </table>

        
        { playerData["gameLeader"] ? <div>
                <p>Play again?</p>
                <button onClick={handleStartNewGame}>New game</button>
            </div> : <></>
        }

        
    </div>
  );
}

export default WordGridScoring;