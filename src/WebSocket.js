import React, { createContext } from 'react'
import io from 'socket.io-client';
import useLocalStorage from "./hooks/useLocalStorage"
import { WS_BASE } from './config';
import { useDispatch } from 'react-redux';
import { updateChatLog } from './actions';
import { connect } from 'react-redux';
import { Socket } from 'dgram';

const WebSocketContext = createContext()

export { WebSocketContext }

export default ({ children }) => {
    
    let chatSocket;
    let categoriesSocket;
    let publicSocket;
    let ws;

    let [gameID, setGameID] = useLocalStorage('gameID', '')
    let [userName, setUserName] = useLocalStorage('userName', '')
    let [gameData, setGameData] = useLocalStorage('gameData', {})
    let [playerData, setPlayerData] = useLocalStorage('playerData', {})
    let [gameSessionID, setGameSessionID] = useLocalStorage('gameSessionID', '')
    let [userID, setUserID] = useLocalStorage('userID', '')
    let [returning, setReturning] = useLocalStorage('returning', false)
    let [playerList, setPlayerList] = useLocalStorage('playerList', [])
    
    // let gameID = '';

    // let userID;
    // let gameSessionID;
    // let returning;
    // let userName;
    // let gameData;
    // let playerData;
    let chatMessages;


    // const dispatch = useDispatch();

    // Private socket
    // const connectGameLeader = (gameData, playerData) => {
    //     privateSocket.send(
    //         JSON.stringify(
    //             {
    //                 "messageType" : "start-game",
    //                 "userID" : userID,
    //                 "userName" : playerData.userName,
    //                 "gameLeader" : true,
    //                 "gameData" : gameData
    //             }
    //         )
    //     )
    //     return {}
    // }

    //////////////////////////////////////////////////////////
    // chat functions 

    // chatSocket = io('http://localhost:8000/chat');
    
    // chatSocket.on('connect',
    //     () => chatSocket.emit('joinChatRoom', { "gameID" : gameID })
    // );

    // function pastMessages(data){
    //     chatMessages = JSON.parse(data);
    // }

    // chatSocket.on('messageList',
    //     (data) => {
    //         if (data){
    //             pastMessages(data)
    //         }
    //     }
    // );

    // function sendChatMessage(data){
    //     chatSocket.emit('sendMessage', {
    //         gameID,
    //         userID,
    //         messg : data.messg
    //     })
    // }

    // function deleteMessage(data){
    //     chatSocket.emit(
    //         "deleteMessage",
    //         {
    //             userID,
    //             messageTime: data["messageTime"],
    //             gameID
    //         }
    //     )
    // }
    //////////////////////////////////////////////////////////////////////////
    // categories

    categoriesSocket = io('https://tom-games.azurewebsites.net/' + "categories");
    
    categoriesSocket.on('connect',
        () => {
            console.log("bad connected categories")
           
            // categoriesSocket.emit('joinGame', { gameID });
            // categoriesSocket.emit('joinWaitingRoom', { gameID })
        }
    );
    
    
    //////////////////
    // starting the game
    function connectGameLeaderCategories(data){
        categoriesSocket.emit("join", {"gameID" : data["gameID"]})
        categoriesSocket.emit("connectGameLeaderCategories", 
            data
        )

        // if (!returning){
        //     setPlayerList(
        //         {
        //             "userName" : userName,
        //             "userID" : userID,
        //             "gameLeader" : true
        //         }
        //     )
        // }
        // if a new game
        // if (playerList.length == 0){
        //     playerList.push({
        //         "userName" : data.userName,
        //         "userID" : data.userID,
        //         "gameLeader" : true
        //     })
        // }
    }

    function setPlayerListWS(playerList){
        setPlayerList(playerList)
    }
    function setUserIDWS(userID){
        setUserID(userID)
    }
    function setGameSessionIDWS(gameSessionID){
        setGameSessionID(gameSessionID)
    }
    function setGameIDWS(gameID){
        setGameID(gameID)
    }

    function joinCategoriesGame(gameID){
        // console.log("**************")
        // console.log("joined game")
        categoriesSocket.emit( "joinGame", gameID )
        // console.log("**************")
    }

    function categoriesAddPlayer(data){
        categoriesSocket.emit( "addPlayer", data )
    }

    function joinCategoriesWaitingRoom(gID){
        categoriesSocket.emit(
            "joinWaitingRoom",
            {
                gameID
            }
        )
    }

    // categoriesSocket.on("joined-room", ()=>{
    //     console.log("joined room")
    // } )

    //////////////////
    //  joining the game
    

    // function categoriesSubscribe(cb){
    //     categoriesSocket.on("joined-room", ()=>{
    //         console.log("joined room")
    //     } )

    //     categoriesSocket.on(
    //         "newPlayer",
    //         (data) => {
    //             console.log("**************")
    //             console.log("newPlayer")
    //             // setPlayerList(data.playerList)
    //             // playerList = data.playerList
    //             console.log(playerList)
    //             console.log("**************")
    //         }
    //     );
    
    //     categoriesSocket.on(
    //         "startGame", () => startGame()
    //     )
    
    //     categoriesSocket.on(
    //         "playerList", 
    //         (resp) => {
    //             console.log("**************")
    //             console.log("called")
    //             setPlayerList(resp.playerList)
    //             //playerList = resp.playerList
    //             console.log("**************")
    //         }
    //     )
        
    // }
    
    // categoriesSocket.on(
    //     "newPlayer",
    //     (data) => {
    //         console.log("**************")
    //         console.log("newPlayer")
    //         // setPlayerList(data.playerList)
    //         // playerList = data.playerList
    //         console.log(playerList)
    //         console.log("**************")
    //     }
    // );

    // categoriesSocket.on(
    //     "startGame", () => startGame()
    // )

    // categoriesSocket.on(
    //     "playerList", 
    //     (resp) => {
    //         console.log("**************")
    //         console.log("called")
    //         setPlayerList(resp.playerList)
    //         //playerList = resp.playerList
    //         console.log("**************")
    //     }
    // )

    // $("#start").click(function(){
    //     sendStart()
    //     startGame()
    // })

    function sendStart(){
        categoriesSocket.emit("sendStart", {gameID})
    }
    
    function startGame(){
        // to game
        // window.location.replace()
    }

    // $(".copyLink").click(function(){
    //     var copyText = "{{ url_for('categories.joinGameRoute', _external=True) + '?gameID=' + gameID }}" ;
        
    //     var $temp = $("<input>");
    //     $("body").append($temp);
    //     $temp.val(copyText).select();
    //     document.execCommand("copy");
    //     $temp.remove();
        
    //     $("#copiedNotification").css("visibility", "visible")
    // })

    //////////////////
    // game emits

    categoriesSocket.on('gameEnded', () => categoriesSendAnswers());

    function categoriesEndGame(pressedStop){
        if (pressedStop){
            categoriesSocket.emit('endGame', { "gameID" : gameID, "pressedStop" : userID } );
        }else{
            categoriesSocket.emit('endGame', { "gameID" : gameID });
        }
    }

    function categoriesSendAnswers(data){
        
        var answers = {
            "userID" : userID,
            "answers" : data.answers
        }
        
        console.log(answers);

        categoriesSocket.emit('sendAnswers', { "gameID" : gameID, "answer" : answers} );

        // window.location.replace("{{url_for('categories.showResults')}}");
    }

    categoriesSocket.on('gameEndedTimeout', () => categoriesSendAnswers());

    // var startTimer = function() {

    //     var i = 240;
    //     // store the interval id to clear in future
    //     var intr = setInterval(function() {
    //         var mins = Math.floor(i/60);
    //         var secs = i%60 >= 10 ? i%60 : `0` +`${i % 60}`
    //         if (i!=300) document.getElementById('timeleft').innerHTML = `${mins}:${secs}`;
    //         i -= 1
    //         // clear the interval if `i` reached 100
    //         if (i === 0) {
    //             clearInterval(intr);
    //             endGame()
    //         };
    //     }, 1000)
    // }
    // into game
    // function validateAnswers() {

    //     numValid = 0

    //     $('.categoryInput').each(function() {
    //         if ( $(this).val() !== '' )
    //             numValid += 1;
    //     });

    //     if (numValid === $('.categoryInput').length){
    //         return true
    //     }
    //     else{
    //         return false
    //     }

    // }

    // $(".categoryInput").keyup(function(){
    //     // check that there is an item in all the categories before undisabling the finished button
    //     if (validateAnswers()){
    //         $("#finished").prop("disabled", false);
    //     }
    // })
    
    // $("#finished").on('click', function(){
    //     endGame(true)
    // });




    //////////////////////////////////////////////////////////////////////////
    // messages only to the player

    // privateSocket = io.connect("http://localhost:8000")
    // //privateSocket = new WebSocket("ws://localhost:8000/categories");

    // privateSocket.onmessage = (event) => {
        
    //     const payload = JSON.parse(event.data)
        
    //     console.log(payload)

    //     if(payload.messageType == "connection-made-public"){
    //         userID = payload.userID
    //     }
        
    //     if (payload.messageType == "join-game"){
            
    //         console.log("connected")
    //         console.log(payload)
            
    //         gameID = payload.gameID
            
    //         publicSocket = new io.connect("http://localhost:8000/")
    //         //publicSocket = new WebSocket(`ws://localhost:8000/categories/game/${gameID}`)
            
    //         publicSocket.send(
    //             JSON.stringify(
    //                 {
    //                     "messageType" : "join-game",
    //                     "userID" : userID
    //                 }
    //             )
    //         )

    //         publicSocket.onmessage = (event) => {
                
    //             let publicPayload = JSON.parse(event.data)

    //             if (publicPayload.messageType === "connection-made-public"){
    //                 playerData = publicPayload.playerData
    //             }
    //         }
    //     } 
    // }

    /////////////////////////////////////////////////////////////////////
    // export all these globals
    if (!ws){

        ws = {
            chatSocket,
            categoriesSocket,
            gameID,
            gameSessionID,
            userID,
            returning,
            gameData,
            playerData,
            playerList,
            // setPlayerList,
            // getPlayerList,
            
            setGameIDWS,
            setGameSessionIDWS,
            setUserIDWS,
            setPlayerListWS,

            connectGameLeaderCategories,
            joinCategoriesGame,
            joinCategoriesWaitingRoom,
            categoriesAddPlayer,
            categoriesSendAnswers,
            categoriesEndGame,
            playerList,

            // categoriesSubscribe,
            
            // connectPlayer,
            // setUserName
        }
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}