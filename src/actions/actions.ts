interface ReduxAction {
    type: string
    payload?: any
}

// wordgrid

export const addWordGridWord = (payload: any): ReduxAction => ({
    type: "ADD_WORD_WORDGRID",
    payload: payload.word
})

export const clearWordGridEnteredWords = (): ReduxAction => ({
    type: "CLEAR_WORDGRID_ENTERED_WORDS",
})

export const setWordGridGameData = (payload:any): ReduxAction => ({
    type: "SET_GAME_DATA",
    payload: payload
})

export const setAllWordGridAnswers = (payload:any): ReduxAction => ({
    type: "SET_WORDGRID_ANSWERS",
    payload: payload
}
)

export const setNewWordGridBoard = (): ReduxAction => ({
    type: "SET_NEW_WORDGRID_BOARD",
})

// wordgrid solver

export const clearWordGridSolver = (): ReduxAction => ({
    type: "CLEAR_WORD_GRID_SOLVER",
})
