import {io} from "socket.io-client";
import React from 'react';
import { SOCKETURL } from '../constants'

// console.log(SOCKETURL + 'categories')
// export const socket = io( 'https://tom-games.azurewebsites.net/categories');
export const socket = io( SOCKETURL + 'categories')
export const SocketContext = React.createContext(socket);

export const picturesocket = io(SOCKETURL + "picture-guess")
export const PictureSocketContext = React.createContext(picturesocket)

export const wordGridsocket = io(SOCKETURL + "wordGrid")
export const wordGridSocketContext = React.createContext(wordGridsocket)

export const wordGridSolversocket = io(SOCKETURL + "wordGridSolver")
export const wordGridSolverSocketContext = React.createContext(wordGridSolversocket)