import React, {useState, useReducer, useContext, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Category from "../models";
import sampleCategories from "./sampleCategories.json";
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";


const categoriesReducer = (state:any, action:any) => {
    switch (action.type) {
        case 'REMOVE_ITEM':
            return ({
            ...state,
            list : state.list.filter((item:Category) => item.key !== action.key)
            })
        case 'ADD_ITEM':
            return ({
                ...state,
                list : state.list.concat({name: action.name, key: action.key, answer: ""})
            })
        case 'UPDATE_ITEM':
            return ({
                ...state,
                list : state.list.map(
                    (category: Category) => {
                        if (action.key === category.key){
                            const updatedItem = {
                                ...category,
                                name : action.name
                            };
                            return updatedItem
                        }else{
                            return category
                        }
                    }
                )
            })
        case 'RESET_LIST':
            return ({
                ...state,
                list : sampleCategories
            })
      default:
        throw new Error();
    }
};

function randomLetter(){
    return String.fromCharCode(65+Math.floor(Math.random() * 26))
}


function CategoriesStart() {

    // random letter
    const [gameLetter, setLetter] = useState(randomLetter())
    const [categoryList, dispatchListData] =  useReducer(categoriesReducer, {
        list: sampleCategories
    });
    const [userNameError, setUserNameError] = useState(false)
    const [categoryError, setCategoryError] = useState(false)
    
    const history = useHistory();
    // const ws = useContext(WebSocketContext);

    let [gameID, setGameID] = useLocalStorage('gameID', '')
    let [userName, setUserName] = useLocalStorage('userName', '')
    let [gameData, setGameData] = useLocalStorage('gameData', {})
    let [playerData, setPlayerData] = useLocalStorage('playerData', {})
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID', '')
    let [userID, setUserID] = useLocalStorage('userID', '')
    let [returning, setReturning] = useLocalStorage('returning', false)
    let [playerList, setPlayerList] = useLocalStorage('playerList', [])

    useEffect(() => {
        return setGameData({
            "categories" : categoryList.list,
            "gameLetter" : gameLetter
        })
        
      }, [categoryList]);


    function newLetter(){
        
        let newLetter = randomLetter()
        
        setLetter(newLetter)
        
        setGameData(
            {
                "categories" : categoryList.list,
                "gameLetter" : newLetter
            }
        )
    }

    // category list
    

    function handleChange(event : any){
        
        dispatchListData({"type" : "UPDATE_ITEM", key: event.target.id, name : event.target.value })
        
        setGameData(
            {
                "categories" : categoryList.list,
                "gameLetter" : gameLetter
            }
        )
    
    }
  
    function handleRemove(key : string){
        dispatchListData({type:"REMOVE_ITEM", "key" : key })
        setGameData(
            {
                "categories" : categoryList.list,
                "gameLetter" : gameLetter
            }
        )
    }

    function handleAdd(){
        console.log("clicked handle")
        dispatchListData({type:"ADD_ITEM", key: uuidv4()})
        setGameData(
            {
                "categories" : categoryList.list,
                "gameLetter" : gameLetter
            }
        )
    }

    function handleReset(){
        console.log("clicked reset")
        dispatchListData({type:"RESET_LIST"})
        setGameData(
            {
                "categories" : categoryList.list,
                "gameLetter" : gameLetter
            }
        )
    }

    // user
    
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
        setGameData(
            {
                "categories" : categoryList.list,
                "gameLetter" : gameLetter
            }
        )

    }

    // submit form

    function startGame(event:any){

        setGameData(
            {
                "categories" : categoryList.list,
                "gameLetter" : gameLetter
            }
        )

        // check that the player has at least one category
        setCategoryError(categoryList.list.length === 0) 
        setUserNameError(!userName)

        // check that the player has added a username
        if ((categoryList.list.length === 0) || (!userName)){
            return
        }
        else {

            
            history.push(
                {
                    "pathname" : '/categories-waiting-room',
                }
            )

        }

    }

    return (
    <div className="project">
        <p>A multiplayer game - find a word that starts with the following letter for each category!</p>
        
        <p className="explainer">
            As the game leader, it's up to you to set the game up!
        </p>
        
        <p>Letter to guess: </p>
        <span className="gameLetter" id="gameLetter">{gameLetter}</span>
        <button 
            id="newLetter"
            onClick={()=>{newLetter()}}
            style={{
                "marginLeft": "20px"
            }}
        >
            New letter
        </button>

        <p>1. (Optional) Change or add more categories:</p>
        <p className="explainer">Click a category to change the name, or the button to remove it. </p>
        { 
            categoryList.list.map(
                (category: Category) => {
                    return (
                    <div className="category">
                        <input
                            type="text" 
                            id={category.key} 
                            defaultValue={category.name}
                            onChange={(e)=>handleChange(e)}
                        />
                        <button onClick={()=>handleRemove(category.key)}>
                            Remove
                        </button>
                    </div>
                    )
                }
            )
        }

        <button
            type="button"
            onClick={() =>handleAdd()}
            style={{
                "marginRight": "5px"
            }}
        >
            Add category
        </button>

        <button
            type="button"
            onClick={() =>handleReset()}
        >
            Reset to default
        </button>

        <p className={ categoryError ? "showError" : "hideError" }>Please have at least one category before continuing.</p>
        <p>2. Enter your user name:</p>
        
        <input 
            type="text" 
            id="username" 
            placeholder="Add username" 
            onChange={(e)=>{handleUserNameChange(e)}} 
            value={userName}
            style={{
                "paddingRight": "5px"
            }}
        />

        <p className={ userNameError ? "showError" : "hideError" }>Please enter a username before continuing.</p>
        <p>3. Click start game:</p>

        <button 
            className="start-game" 
            onClick={(e)=>{startGame(e)}}
            style={{
                "marginBottom": "20px"
            }}
        >
            Start Game
        </button>
    </div>
  );
}

export default CategoriesStart;