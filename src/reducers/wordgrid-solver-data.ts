interface ReduxAction {
    type: string
    payload?: any
}



function genEmptySolverBoard(){

    const tilePlacement = [
        "A1", "A2", "A3", "A4",
        "B1", "B2", "B3", "B4",
        "C1", "C2", "C3", "C4",
        "D1", "D2", "D3", "D4"
    ]

    var board : BoardSolverLayout;
    board = {}

    for (var ind in tilePlacement){
        board[tilePlacement[ind]] = ""
    }

    console.log("empty board")
    console.log(board)

    return board

}

export interface BoardSolverLayout  {
    [key: string] : string
}
export const intialWordGridSolverBoardLayout = genEmptySolverBoard() as BoardSolverLayout

export const wordGridSolverLayout = (
    state: BoardSolverLayout = intialWordGridSolverBoardLayout,
    action: ReduxAction
): BoardSolverLayout => {
    switch(action.type){
        case 'SET_WORD_GRID_SOLVER':
            // console.log("setting wordGrid answers")
            // console.log(action.payload)
            return action.payload
        case 'CLEAR_WORD_GRID_SOLVER':
            return genEmptySolverBoard()
        default:
            return state
    }

}

export default wordGridSolverLayout