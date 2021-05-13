import {io} from "socket.io-client";
import React from 'react';

export const socket = io('http://localhost:8000/categories');

export const SocketContext = React.createContext(socket);
