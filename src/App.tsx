import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
// import WebSocketProvider, { WebSocketContext } from "./WebSocket";
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import GamesList from "./components/GamesList";
import Header from "./components/Header";
import Categories from "./categories/categories";
import CategoriesJoin from "./categories/CategoriesJoin"
import CategoriesWaiting from "./categories/CategoriesWaiting";
import CategoriesGame from "./categories/CategoriesGame";
import CategoriesScoring from "./categories/CategoriesScoring";
import PictureGuess from "./pictureguess/Pictureguess";
import './App.css';
import {SocketContext, socket} from "./context/socket2"
import useLocalStorage from "./hooks/useLocalStorage";
function App() {

    return (
        <Provider store={store}>
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
                            
                            <Route path="/picture-guess" component={PictureGuess}/>
                        </Switch>
                    </div>
                </div>
            </SocketContext.Provider>
        </Provider>
    );
}

export default App;
