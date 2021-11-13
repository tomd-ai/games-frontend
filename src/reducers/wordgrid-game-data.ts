interface ReduxAction {
    type: string
    payload?: any
}

function genNewBoard(){
    const availableOptions = "AAEEGN, ELRTTY, AOOTTW, ABBJOO, EHRTVW, CIMOTU, DISTTY, EIOSST, DELRVY, ACHOPS, HIMNQU, EEINSU, EEGHNW, AFFKPS, HLNNRZ, DEILRX".split(", ").map(x=>x.split(''))

    function shuffleArray(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    // shuffle list of indicies
    //let arrayOrder =  Array(16).fill(-1).map( (_, i) => i+1 ).map( (_, i) => i -1 == -1 ? 15 : i-1 )
    let arrayOrder = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    arrayOrder = shuffleArray(arrayOrder)
    
    const tilePlacement = [
        "A1", "A2", "A3", "A4",
        "B1", "B2", "B3", "B4",
        "C1", "C2", "C3", "C4",
        "D1", "D2", "D3", "D4"
    ]

    var board : BoardLayout;
    board = {}

    for (var ind in tilePlacement){
        var randInd = Math.floor(Math.random() * 6);
        board[tilePlacement[ind]] = availableOptions[arrayOrder[ind]][randInd]
    }

    return board

}


export interface BoardLayout  {
    [key: string] : string
}

export const intialWordGridBoardLayout = genNewBoard() as BoardLayout

export const wordGridBoardLayout = (
    state: BoardLayout = intialWordGridBoardLayout,
    action: ReduxAction
): BoardLayout => {
    switch(action.type){
        case 'SET_GAME_DATA':
            console.log("setting wordGrid answers")
            console.log(action.payload)
            return action.payload
        case 'SET_NEW_WORDGRID_BOARD':
            return genNewBoard()
        default:
            return state
    }

}

export default wordGridBoardLayout