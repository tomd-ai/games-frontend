interface ReduxAction {
    type: string
    payload?: any
}

export interface WordGridDictWord {
    word: string
    path: string[],
    definition: string
}

export interface EnteredWords {
    wordList?: string[]
}

export interface WordGridPlayerAnswers {
    enteredWords: EnteredWords,
    gameID: string,
    playerScore: number,
    userID: string,
    userName: string
}

export interface AllWordGridAnswers {
    dictionaryAnswers: WordGridDictWord[]
    allAnswers: WordGridPlayerAnswers[]
}

export const intialAllWordGridAnswers = {
    dictionaryAnswers: [],
    allAnswers: []
} as AllWordGridAnswers

export const wordGridPlayerAnswers = (
    state: AllWordGridAnswers = intialAllWordGridAnswers,
    action: ReduxAction
): AllWordGridAnswers => {
    switch(action.type){
        case 'SET_WORDGRID_ANSWERS':
            // console.log("setting wordGrid answers")
            // console.log(action.payload)
            return {
                dictionaryAnswers: action.payload["dictionaryAnswers"],
                allAnswers: action.payload["allAnswers"]
            }
        default:
            return state
    }

}

export default wordGridPlayerAnswers