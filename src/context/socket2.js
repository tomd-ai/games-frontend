import {io} from "socket.io-client";
import React from 'react';
import { SOCKETURL } from '../constants'

export const socket = io( SOCKETURL + '/categories');

export const SocketContext = React.createContext(socket);
