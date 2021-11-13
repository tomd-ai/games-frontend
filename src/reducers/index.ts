import { combineReducers } from 'redux';
import wordGridEnteredWordList from './wordgrid';
import wordGridPlayerAnswers from './wordgrid-scoring';
import wordGridGameData from "./wordgrid-game-data";
import wordGridSolverLayout from "./wordgrid-solver-data"

const allReducers = combineReducers({
    wordGridEnteredWords: wordGridEnteredWordList,
    wordGridPlayerAnswers: wordGridPlayerAnswers,
    wordGridGameData: wordGridGameData,

    wordGridSolverData: wordGridSolverLayout
});

export default allReducers;