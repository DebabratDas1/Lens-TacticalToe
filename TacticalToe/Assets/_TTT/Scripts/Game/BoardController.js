//BoardController.js
//@input Component.ScriptComponent turnBased
//@input Component.ScriptComponent[] cells


//@input Asset.ObjectPrefab userCard
// @input SceneObject spawnParent
//@input SceneObject gridParent

var currentPlayer
var otherPlayer
var currentTurn
var positions = []
var xoArray = []
var grid = []
var cell = []

var spellFunctionalGrids = []
var activatedSpellType;



function getGridData(){
    return grid;
}

script.getGridData = getGridData;


getPositionGrid()

function getPositionGrid(){
    print("Inside getPositionGrid")
    for(var i = 0; i < script.gridParent.getChildrenCount(); i++){
        var pos = script.gridParent.getChild(i).getComponent("Component.ScreenTransform").anchors.getCenter()
        positions.push(pos)
    }
}


function turnStarted(){
    getPlayers()
    getCurrentTurn()
    getGrid()
    highlightAllCells(false)

    script.spellManager.turnStarted();

}

script.turnBased.onTurnStart.add(function (evt) {
        print("onTurnStart: user=" + evt.currentUserIndex + " turn=" + evt.turnCount);
        turnStarted(); // your existing function
    });

/*function setupTurnBasedEvents() {
    if (!script.turnBased || !script.turnBased.api) {
        print("BoardController: turnBased.api not set");
        return;
    }

    // Fires when a turn actually starts (for user 0 or 1)
    script.turnBased.api.onTurnStart.add(function (evt) {
        print("onTurnStart: user=" + evt.currentUserIndex + " turn=" + evt.turnCount);
        turnStarted(); // your existing function
    });

    // Logs INCOMPLETE_TURN_DATA_SENT / RECEIVED
    script.turnBased.api.onError.add(function (evt) {
        print("TurnBased ERROR: " + evt.code + " - " + evt.description);
    });
}

// Run once on awake
script.createEvent("OnAwakeEvent").bind(setupTurnBasedEvents);
*/

async function getPlayers(){
    currentPlayer = await script.turnBased.getCurrentUserIndex()
    otherPlayer = await script.turnBased.getOtherUserIndex()

    print(currentPlayer + " is current player ")
    print(otherPlayer + " is other player ")

}

async function getCurrentTurn(){
    currentTurn = await script.turnBased.getTurnCount()
    print("Turn Count "+currentTurn)
}

async function getGrid(){
    grid = await script.turnBased.getGlobalVariable("gridData")
    if(grid == undefined){
        grid = [
        global.CellType.None,
        global.CellType.None,
        global.CellType.None,
        global.CellType.None,
        global.CellType.None,
        global.CellType.None,
        global.CellType.None,
        global.CellType.None,
        global.CellType.None,

        ]

    }
    print("Grid : "+grid);
    populateGrid()
}

function populateGrid(){
    print("Inside populateGrid, Grid = "+grid);

    clearArray()

    for(var i = 0; i<grid.length; i++){

        if(grid[i] == global.CellType.User1 || grid[i] == global.CellType.User2){
            var newObj = script.userCard.instantiate(script.spawnParent)
            var transform = newObj.getComponent("Component.ScreenTransform")
            newObj.name = "Card_Cell_" + i;
            transform.anchors.setCenter(positions[i])
            xoArray.push(newObj)
            var newCard = getCardComponent(newObj);
            print("New Card Name : " +newCard.getName());

            var targetUser = (grid[i] == global.CellType.User1) ? 0 : 1;
            newCard.setTargetUser(targetUser);


        }

        
    }

}

function clearArray(){
    for(var i = 0; i<xoArray.length; i++){
        xoArray[i].destroy()
    }
    xoArray = []
}

var hasMovedThisTurn = false;

function gridTapped(gridIndex){
    print("gridIndex : "+gridIndex)
    print("Inside Grid Tapped");

    /*if(grid[gridIndex] != 0){
        return;
    }*/
    if(activatedSpellType == undefined || activatedSpellType == global.SpellType.None){
        print("Inside Grid Tapped Spell None");
        

        if(grid[gridIndex] != 0){
        return;
        }

        grid[gridIndex] = currentPlayer == 0 ? global.CellType.User1 : global.CellType.User2



    }
    else if(activatedSpellType == global.SpellType.Steal){
        print("Inside Grid Tapped Spell STEAL");
        print("spellFunctionalGrids.includes(gridIndex)" + spellFunctionalGrids.includes(gridIndex));
        print("spellFunctionalGrids   "+spellFunctionalGrids);


        if(spellFunctionalGrids.includes(gridIndex)){
            print("FunctionalSpell includes current grid");

            print("Current player : "+currentPlayer +"  grid[gridIndex]  : "+grid[gridIndex]);

            if(currentPlayer == 0 && grid[gridIndex] == global.CellType.User2){
                print("Current user is 0, and Tapped grid is occupied by Another user2");
                print("Previous grid : "+grid);

                grid[gridIndex] = global.CellType.User1;
                print("Updated grid : "+grid);
                script.spellManager.spellUsed(activatedSpellType);
                script.spellManager.activateSpell(activatedSpellType);

            }
            else if(currentPlayer == 1 && grid[gridIndex] == global.CellType.User1){
                print("Current user is 1, and Tapped grid is occupied by Another user1");
                print("Previous grid : "+grid);
                grid[gridIndex] = global.CellType.User2;
                print("Updated grid : "+grid);
                script.spellManager.spellUsed(activatedSpellType);
                script.spellManager.activateSpell(activatedSpellType);


            }
            else{
                print("Error during stealing")
            }

        
        }

    }


    print("Grid  = "+grid);

    
    hasMovedThisTurn = true;

    populateGrid()

    script.turnBased.setGlobalVariable("gridData", grid)

    //var winner = getWinner()

    /*if(winner != 0){
        script.winners[currentPlayer].enabled = true
        script.winners[otherPlayer].enabled = true

        script.turnBased.setIsFinalTurn(true)


    }
    else{
        if(currentTurn == 8){
            script.tie[0].enabled = true
            script.tie[1].enabled = true
            script.turnBased.setIsFinalTurn(true)


        }
    }*/

    //script.turnBased.endTurn()


}

script.gridTapped = gridTapped


// Getting Card Component
// Load the custom component type dynamically
// The path is relative to the current script's location
let cardType = requireType('./Card');

function getCardComponent(targetSceneObject){
    print("Inside GetCardComponent");
    try{
let cardComponent = targetSceneObject.getComponent(cardType);
if(cardComponent){
    print("cardComponent : "+cardComponent);
}
else{
    print("cardComponent Not found: ");
}
    //print("cardComponent : "+cardComponent);
return cardComponent;
} catch (error) {
        print("Error: " + error);
    }


}



function endTurnSafely() {
    if (!hasMovedThisTurn) {
        print("Tried to end turn with no move");
        return;
    }

    hasMovedThisTurn = false;
    script.turnBased.endTurn();
}

// Expose via api so other scripts can call it
script.endTurnSafely = endTurnSafely;

/*script.turnBased.onTurnStart.add(function (evt) {
        print("onTurnStart: user=" + evt.currentUserIndex + " turn=" + evt.turnCount);
        turnStarted(); // your existing function
    });*/




/// ######################## SPELL #################


//@input Component.ScriptComponent spellManager;

function highlightCell(cellIndex, willHighlight){
    script.cells[cellIndex].highlight(willHighlight);
}

function highlightAllCells(willHighlight){
    print("highlightAllCells called, value = " + willHighlight);
    for (var i = 0 ; i < script.cells.length; i++){
        var cellScript = script.cells[i];
        print("cell[" + i + "] script = " + cellScript);
        if (cellScript && cellScript.highlight) {
            print(" -> calling highlight on cell " + i);
            cellScript.highlight(willHighlight);
        } else {
            print(" -> NO highlight() on cell " + i);
        }
    }
}

function highlightAsPerSpell(spellType){
    if(spellType == global.SpellType.Steal){
        print("Inside steal spell to highlight cells");
        if(currentPlayer == 0){
            // TODO : Highlight Cells with type CellType.User2
            for(var i = 0; i< grid.length; i++){
                if(grid[i] == global.CellType.User2){
                    highlightCell(i, true);
                }
            }
        }
        else{
            for(var i = 0; i< grid.length; i++){
                if(grid[i] == global.CellType.User1){
                    highlightCell(i, true);
                }
            }
        }
    }
    else{
        print("Will be implemented Soon");
    }
}

script.highlightAllCells = highlightAllCells;
script.highlightAsPerSpell = highlightAsPerSpell;


function handleSpell(spellType){

    print("Inside Handle Spell *******");
    spellFunctionalGrids = [];
    highlightAllCells(false);
    activatedSpellType = global.SpellType.None;

    // If spell type none, that is spell is NOT activated
    if(spellType == global.SpellType.None){
        
        
    }

    // Spell Type is STEAL
    else if(spellType == global.SpellType.Steal){
        print("Inside Stael Type Spell Handling ----");
        for(var i = 0; i<grid.length; i++){
            if(currentPlayer == 0){
                if(grid[i] == global.CellType.User2){
                spellFunctionalGrids.push(i);
                highlightCell(i, true);
                }
            }
            else{
                if(grid[i] == global.CellType.User1){
                spellFunctionalGrids.push(i);
                highlightCell(i, true);
            }

            }
            
        }
        activatedSpellType = global.SpellType.Steal;

        print(spellFunctionalGrids + "spellFunctionalGrids");
    }

    else{
        print("More spells is being processed");
    }

}

script.handleSpell = handleSpell

