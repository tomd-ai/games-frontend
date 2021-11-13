import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
// import WebSocketProvider, { WebSocketContext } from "./WebSocket";
import { Provider } from 'react-redux';
import GamesList from "./components/GamesList";
import Header from "./components/Header";
import Categories from "./categories/categories";
import CategoriesJoin from "./categories/CategoriesJoin";
import CategoriesWaiting from "./categories/CategoriesWaiting";
import CategoriesGame from "./categories/CategoriesGame";
import CategoriesScoring from "./categories/CategoriesScoring";
import PictureGuess from "./pictureguess/Pictureguess";
import WordGridSetup from "./wordGrid/WordGridSetup";
import WordGridJoin from "./wordGrid/WordGridJoin";
import WordGridWaiting from "./wordGrid/WordGridWaiting";
import WordGridScoring from "./wordGrid/WordGridScoring";
import WordGridGame from "./wordGrid/WordGridGame";
import './App.css';
import {SocketContext, socket} from "./context/socket2"
import {PictureSocketContext, picturesocket} from "./context/socket2"
import useLocalStorage from "./hooks/useLocalStorage";
import WordGridSolver from './wordGridSolver/wordGridSolver';

function App() {
    // TODO: boot people out
    // TODO: keep score
    // 
    return (
        <PictureSocketContext.Provider value={picturesocket}>
        <SocketContext.Provider value={socket}>
            <div className="App">
                <div className="header">
                    <Header/>
                </div>
                
                <div className="main-content">
                    <Switch>
                        <Route exact path="/" component={GamesList}/>
                        
                        <Route path="/categories" component={Categories}/>
                        <Route exact path="/join-categories/:gameID" component={CategoriesJoin}/>
                        <Route path="/categories-waiting-room" component={CategoriesWaiting}/>
                        <Route path="/categories-game-room" component={CategoriesGame}/>
                        <Route path="/categories-scoring" component={CategoriesScoring}/>
                        
                        <Route path="/picture-guess/:gameID" component={PictureGuess}/>
                        <Route path="/picture-guess" component={PictureGuess}/>

                        <Route path="/wordGrid" component={WordGridSetup} />
                        <Route exact path="/join-wordGrid/:gameID" component={WordGridJoin}/>
                        <Route path="/wordGrid-waiting-room" component={WordGridWaiting}/>
                        <Route path="/wordGrid-game-room" component={WordGridGame}/>
                        <Route path="/wordGrid-scoring" component={WordGridScoring}/>

                        <Route path="/wordGridSolver" component={WordGridSolver} />
                    </Switch>
                </div>
            </div>
        </SocketContext.Provider>
        </PictureSocketContext.Provider>
    );
}

export default App;
