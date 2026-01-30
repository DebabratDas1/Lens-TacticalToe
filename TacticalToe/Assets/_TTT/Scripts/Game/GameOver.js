// GameOver.js

//@input Component.ScriptComponent boardController
//@input Component.ScriptComponent turnBased


//@input SceneObject player1Winner
//@input SceneObject player2Winner
//@input SceneObject player1Looser
//@input SceneObject  player2Looser;
//@input Component.SceneObject winLooserIndicator
//@input Component.SceneObject tieIndicator

//@input SceneObject player1WinnerName;
//@input SceneObject player1LooserName;
//@input SceneObject player2WinnerName;
//@input SceneObject player2LooserName;
//@input SceneObject player1TieName;
//@input SceneObject player2TieName;







// Returns:
//   global.CellType.User1  → User1 wins
//   global.CellType.User2  → User2 wins
//   0                     → no winner yet (either not full, or has spells, or no 3-in-a-row)
function getWinner() {

    print("Inside getWinner");

    // Winning combinations (rows, columns, diagonals)
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],     // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],     // columns
        [0, 4, 8], [2, 4, 6]                 // diagonals
    ];

    var grid = script.boardController.getGridData();

    for (let combo of wins) {
        const [a, b, c] = combo;

        const cellA = grid[a];
        const cellB = grid[b];
        const cellC = grid[c];

        // All three cells must:
        // 1. Have the same owner
        // 2. Owner is not None
        // 3. None of them has any attached spell
        if (
            cellA.owner !== global.CellType.None &&
            cellA.owner === cellB.owner &&
            cellB.owner === cellC.owner &&
            cellA.spells.length === 0 &&
            cellB.spells.length === 0 &&
            cellC.spells.length === 0
        ) {
            print(`Winner found! Player ${cellA.owner} completed line: ${a}-${b}-${c}`);
            return cellA.owner;
        }
    }

    return 0; // No winner
}
script.getWinner = getWinner;


// Returns:
//   true  → board is full and has no spells left → game should end
//   false → game continues
function isBoardCompleteNoSpells() {
    var grid = script.boardController.getGridData();
    for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];

        // 1. Every cell must have an owner
        if (cell.owner === global.CellType.None) {
            return false;
        }

        // 2. No cell should have any spell attached
        if (cell.spells && cell.spells.length > 0) {
            return false;
        }
    }

    print("Board is full and no spells remain → checking for winner or tie");
    return true;
}
script.isBoardCompleteNoSpells = isBoardCompleteNoSpells;


function checkGameEnd() {
    print("Inside CheckEndGame");
    const winner = getWinner();

    print("After checking winner : "+winner);

    if (winner !== 0) {
        //script.winners[winner].enabled = true;
        //script.turnBased.setIsFinalTurn(true);

        script.winLooserIndicator.enabled = true;


        if (winner === global.CellType.User1) {
            //if (script.player1Winner) script.player1winner.enabled = true;
            //if (script.player2Looser)  script.player2loser.enabled  = true;
            //if (script.player1WinnerName) script.player1WinnerName.enabled = true;
            //if (script.player2LooserName)  script.player2LooserName.enabled  = true;
            print("Inside winnr user 1");

            script.player2Winner.enabled = false;
            script.player1Looser.enabled  = false;
            script.player2WinnerName.enabled = false;
            script.player1LooserName.enabled  = false;

        } else if (winner === global.CellType.User2) {
            print("Inside winnr user 1");
            
            if (script.player1Winner) script.player1Winner.enabled = false;
            if (script.player2Looser)  script.player2Looser.enabled  = false;
            if (script.player1WinnerName) script.player1WinnerName.enabled = false;
            if (script.player2LooserName)  script.player2LooserName.enabled  = false;

            //if (script.player2winner) script.player2winner.enabled = true;
            //if (script.player1loser)  script.player1loser.enabled  = true;
            //if (script.player2WinnerName) script.player2WinnerName.enabled = true;
            //if (script.player1LooserName)  script.player1LooserName.enabled  = true;
        }

        print("Set Final turn");


        script.turnBased.setIsFinalTurn(true);
        print(`Game Over - Player ${winner} wins`);

        // Optional: disable input, play win sound, etc.
        return true; // game ended
    }

    if (isBoardCompleteNoSpells()) {
        //script.tie[0].enabled = true;
        //script.tie[1].enabled = true;
        script.tieIndicator.enabled = true;
        script.turnBased.setIsFinalTurn(true);
        // Optional: tie sound, animation
        return true; // game ended
    }

    return false; // game continues
}
script.checkGameEnd = checkGameEnd;