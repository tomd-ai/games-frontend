
interface ReduxAction {
    type: string
    payload?: any
}

export interface EnteredWordState {
    wordList: String[]
}

export const intialEmptyWordsState = {
    wordList: []
} as EnteredWordState

export const wordGridEnteredWordList = (
    state: EnteredWordState = intialEmptyWordsState,
    action: ReduxAction
): EnteredWordState => {
    switch(action.type){
        case 'ADD_WORD_WORDGRID':
            return {
                wordList: [action.payload, ...state.wordList]
            }
        case 'GET_WORDGRID_ENTERED_WORDS':
            return state
        case 'CLEAR_WORDGRID_ENTERED_WORDS':
            return intialEmptyWordsState
        default:
            return state
    }

}

export default wordGridEnteredWordList