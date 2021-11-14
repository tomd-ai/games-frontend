import {useState, useRef, useContext, useCallback, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import useLocalStorage from "../hooks/useLocalStorage";
import {wordGridSocketContext}  from '../context/socket2'
import {addWordGridWord} from "../actions/actions"

function WordGridGame(props:any) {

    const dispatch = useDispatch();
    const history = useHistory();
    const wordGridSocket = useContext(wordGridSocketContext);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [gameID, setGameID] = useLocalStorage('gameID')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [userName, setUserName] = useLocalStorage('userName')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [playerData, setPlayerData] = useLocalStorage('playerData')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let [userID, setUserID] = useLocalStorage('userID')

    let [minutes, setMinutes] = useState("")
    let [seconds, setSeconds] = useState("")
    
    let [newWord, setNewWord] = useState('');
    let [errorStatus, setErrorStatus] = useState('');
    let [errorStatusMessage, setErrorStatusMessage] = useState('');

    let enteredWords = useSelector((s:any) => s.wordGridEnteredWords)
    let gameData = useSelector((s:any) => s.wordGridGameData)
    
    let [rotatePos, setRotatePos] = useState(0);

    const enteredWordsRef = useRef<string[]>([])

    const handleTimerTick = useCallback((data: any)=>{
        
        setMinutes(data["minutes"])
        setSeconds(data["seconds"])
        
        if ( data["minutes"] === 0 && data["seconds"] === 0 ){
            handleForceEndGame()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleForceEndGame = useCallback(()=>{
        // console.log("entered words")
        // console.log(enteredWords)

        const submitAnswers = {
            gameID,
            userID,
            userName,
            enteredWords: {
                wordList: enteredWordsRef.current
            }
        }
        console.log("submit answers is")
        console.log(submitAnswers)
        
        wordGridSocket.emit("send-answers-wordGrid", submitAnswers)

        history.push(
            {
                "pathname" : '/wordGrid-scoring',
            }
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const addWord = useCallback((newWord)=>{
        
        var guess = {
            gameID: gameID,
            guess: newWord
        }
        // console.log(enteredWords)
        if (enteredWords.wordList.includes(newWord)){
            setErrorStatus('showError')
            setErrorStatusMessage("Sorry, word already entered")
            setNewWord("")
            
        }else{
            console.log(guess)
        
            wordGridSocket.emit(
                "check-answer",
                guess
            )
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAnswerRes = useCallback((data: any)=>{
        // console.log("handling response from server")
        // console.log(enteredWords)
        
        if (data["inDict"]){
    
            dispatch(
                addWordGridWord(
                    {
                        word: data["word"]
                    }
                )
            )

            enteredWordsRef.current = [...enteredWordsRef.current, data["word"]]

            console.log(enteredWordsRef)

            setNewWord("")
        }else{
            setErrorStatus("showError")
            setErrorStatusMessage("Sorry, word not found in the grid / dictionary")
            setNewWord("")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=>{
        wordGridSocket.on("get-answers", handleForceEndGame);
        wordGridSocket.on("timer-tick", handleTimerTick);
        wordGridSocket.on("end-game", handleForceEndGame)
        wordGridSocket.on("answer-res", handleAnswerRes)

        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            wordGridSocket.off("get-answers", handleForceEndGame);
            wordGridSocket.off("timer-tick", handleTimerTick);
            wordGridSocket.off("end-game", handleForceEndGame);
            wordGridSocket.off("answer-res", handleAnswerRes);
          };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wordGridSocket, handleForceEndGame, handleTimerTick, handleAnswerRes])

    const handleKeyPress = (e:any) => {
        if (e.key === "Enter"){
            addWord(newWord)
        }
    }

    const rotateGrid = () => {
        // console.log(rotatePos)
        var curPos = rotatePos
        if (curPos + 1 === 4){
            curPos = 0
            setRotatePos(curPos)
        }else{
            setRotatePos(curPos + 1)
        }
    }

    const renderGrid = ()=>{
        switch (rotatePos){
            case 0:
                return (
                <tbody>
                    <tr><td>{gameData.A1}</td><td>{gameData.A2}</td><td>{gameData.A3}</td><td>{gameData.A4}</td></tr>
                    <tr><td>{gameData.B1}</td><td>{gameData.B2}</td><td>{gameData.B3}</td><td>{gameData.B4}</td></tr>
                    <tr><td>{gameData.C1}</td><td>{gameData.C2}</td><td>{gameData.C3}</td><td>{gameData.C4}</td></tr>
                    <tr><td>{gameData.D1}</td><td>{gameData.D2}</td><td>{gameData.D3}</td><td>{gameData.D4}</td></tr>
                </tbody>
                );
            case 1:
                return ( 
                    <tbody>
                        <tr><td>{gameData.D1}</td><td>{gameData.C1}</td><td>{gameData.B1}</td><td>{gameData.A1}</td></tr>
                        <tr><td>{gameData.D2}</td><td>{gameData.C2}</td><td>{gameData.B2}</td><td>{gameData.A2}</td></tr>
                        <tr><td>{gameData.D3}</td><td>{gameData.C3}</td><td>{gameData.B3}</td><td>{gameData.A3}</td></tr>
                        <tr><td>{gameData.D4}</td><td>{gameData.C4}</td><td>{gameData.B4}</td><td>{gameData.A4}</td></tr>
                    </tbody>
                    );
            case 2:
                return ( 
                    <tbody>
                        <tr><td>{gameData.D4}</td><td>{gameData.D3}</td><td>{gameData.D2}</td><td>{gameData.D1}</td></tr>
                        <tr><td>{gameData.C4}</td><td>{gameData.C3}</td><td>{gameData.C2}</td><td>{gameData.C1}</td></tr>
                        <tr><td>{gameData.B4}</td><td>{gameData.B3}</td><td>{gameData.B2}</td><td>{gameData.B1}</td></tr>
                        <tr><td>{gameData.A4}</td><td>{gameData.A3}</td><td>{gameData.A2}</td><td>{gameData.A1}</td></tr>
                    </tbody>
                    )
            case 3:
                return ( 
                    <tbody>
                        <tr><td>{gameData.A4}</td><td>{gameData.B4}</td><td>{gameData.C4}</td><td>{gameData.D4}</td></tr>
                        <tr><td>{gameData.A3}</td><td>{gameData.B3}</td><td>{gameData.C3}</td><td>{gameData.D3}</td></tr>
                        <tr><td>{gameData.A2}</td><td>{gameData.B2}</td><td>{gameData.C2}</td><td>{gameData.D2}</td></tr>
                        <tr><td>{gameData.A1}</td><td>{gameData.B1}</td><td>{gameData.C1}</td><td>{gameData.D1}</td></tr>
                    </tbody>
                    )
        }
    }

    return (
    <div className="project">
        <h1>Let's play</h1>
        <p>Time left: </p>
        <p>{minutes ? minutes.toString() + " minute" : "" } { minutes || seconds ? seconds.toString() + " seconds" : "Game ended"}</p>

        <table className="wordGridTable" style={{tableLayout: "fixed"}}>
            <thead>
            </thead>
                {renderGrid()}
        </table>
        <p style={{fontSize: "14px"}}>stuck? try rotating: </p><button onClick={rotateGrid}>Rotate</button>
        <p>
            Enter words
        </p>
        <input 
            autoComplete="off"
            type="text" 
            id="newWord" 
            placeholder="Add word" 
            onChange={e=>{
                const val = e.target.value
                setErrorStatus("hideError")
                setNewWord(val)}
            }
            value={newWord}
            onKeyPress={handleKeyPress}
        />
        <button className="add-word"  onClick={e=>{
            addWord(newWord)
        }}>Add word</button>

        { playerData.gameLeader && <div> 
            <button className="end-game" onClick={handleForceEndGame}>Force End Game</button>
        </div>
        }
        
        <p className={errorStatus}>{errorStatusMessage}</p>

        <p>Your words: </p>

        <ul>
        {
            enteredWords.wordList.map( (word: string) => {
                return (
                <li key={word}>
                    {word}
                </li>
                )
        })
        }
        </ul>
    </div>
  );
}

export default WordGridGame;