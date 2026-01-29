//BoardController.js
//@input Component.ScriptComponent turnBased
//@input Component.ScriptComponent[] cells

// @input Component.ScriptComponent animHandler  // AnimationHandler.js


//@input Asset.ObjectPrefab userCard
// @input SceneObject spawnParent
//@input SceneObject gridParent

var currentPlayer
var otherPlayer
var currentTurn
//var turnNumber;
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
//    print("Inside getPositionGrid")
    for(var i = 0; i < script.gridParent.getChildrenCount(); i++){
        var pos = script.gridParent.getChild(i).getComponent("Component.ScreenTransform").anchors.getCenter()
        positions.push(pos)
    }
}


async function turnStarted(){


    await getPlayers()
    await script.spellManager.turnStarted(currentPlayer, otherPlayer, currentTurn);

    highlightAllCells(false);


    //getCurrentTurn()
    await getGrid()
    //await script.spellManager.turnStarted(currentPlayer, otherPlayer, currentTurn);


    

}

script.turnBased.onTurnStart.add(function (evt) {
    //    print("onTurnStart: user=" + evt.currentUserIndex + " turn=" + evt.turnCount);
        currentPlayer = evt.currentUserIndex;
        currentTurn = evt.turnCount;
        print("Turn Count "+currentTurn)
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
    //currentPlayer = await script.turnBased.getCurrentUserIndex()
    otherPlayer = await script.turnBased.getOtherUserIndex()

    //print(currentPlayer + " is current player ")
    print(otherPlayer + " is other player ")

}

async function getCurrentTurn(){
    //currentTurn = await script.turnBased.getTurnCount()
    print("Turn Count "+currentTurn)
}

async function getGrid(){
    grid = await script.turnBased.getGlobalVariable("gridData")
    if (grid == undefined) {
    grid = [];
    for (var i = 0; i < 9; i++) {
        grid.push({
            "owner": global.CellType.None,
            "spells": []
        });
    }
}
    //print("Grid : "+grid);
    debugGrid();
    await populateGrid()
}

function debugGrid() {
    print("======= GRID DEBUG =======");
    for (var i = 0; i < grid.length; i++) {
        var cell = grid[i];
        var spellCount = cell.spells ? cell.spells.length : 0;
        
        print("Cell [" + i + "] | Owner: " + cell.owner + " | Spells: " + spellCount);
        
        if (spellCount > 0) {
            print("  -> Spell Details: " + JSON.stringify(cell.spells));
        }
    }
    print("==========================");
}


/**
 * @param {number} index - Grid cell index (0-8)
 * @param {string} action - 'setOwner', 'addSpell', 'removeSpell'
 * @param {any} data - The value to set (Owner ID or Spell Object)
 */
async function updateGridData(index, action, data) {
    print("Updating Grid at [" + index + "] Action: " + action);
    
    var cell = grid[index];

    switch(action) {
        case 'setOwner':
            cell.owner = data;
            break;

        case 'addSpell':
            if (!cell.spells) cell.spells = [];
            cell.spells.push(data);
            break;

        case 'removeSpell':
            // data would be the spell type we want to remove
            cell.spells = cell.spells.filter(function(s) {
                return s.type !== data;
            });
            break;

        case 'clearSpells':
            cell.spells = [];
            break;
    }

    // Sync to the turn-based system immediately
    await script.turnBased.setGlobalVariable("gridData", grid);
    
    // Refresh the visuals
    await populateGrid();
}

script.updateGridData = updateGridData;

async function populateGrid(){
    //print("Inside populateGrid, Grid = "+grid);

    clearArray()

    for(var i = 0; i<grid.length; i++){

        if(grid[i].owner == global.CellType.User1 || grid[i].owner == global.CellType.User2){
            var newObj = script.userCard.instantiate(script.spawnParent)
            var transform = newObj.getComponent("Component.ScreenTransform")
            newObj.name = "Card_Cell_" + i;
            transform.anchors.setCenter(positions[i])
            xoArray.push(newObj)
            var newCard = getCardComponent(newObj);
            //print("New Card Name : " +newCard.getName());

            script.cells[i].setCard(newCard);

            var targetUser = (grid[i].owner == global.CellType.User1) ? 0 : 1;
            newCard.setTargetUser(targetUser);


            // During doing "Populate Grid", we need to consider 2 things
            // 1. If effective turn is less than current turn show the steady (ongoing effect) 
            // 2. If effective turn == current turn && effective user == currentPlayer, apply spell function


            // Now to apply effects for ongoing spells

            var spells = grid[i].spells;

            for(var spellsIndex = 0; spellsIndex< spells.length; spellsIndex++){
                print("Spells[spellsIndex] : "+ spells[spellsIndex]);
                await script.spellManager.processAttchedSpell(newCard, spells[spellsIndex], i);

            }








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

async function gridTapped(gridIndex){
    print("gridIndex : "+gridIndex)
    print("Inside Grid Tapped");

    /*if(grid[gridIndex] != 0){
        return;
    }*/
    if(activatedSpellType == undefined || activatedSpellType == global.SpellType.None){
        print("Inside Grid Tapped Spell None");
        

        if(grid[gridIndex].owner != 0){
        return;
        }

        var newOwner = (currentPlayer == 0) ? global.CellType.User1 : global.CellType.User2;
        await updateGridData(gridIndex, 'setOwner', newOwner);

        //grid[gridIndex].owner = currentPlayer == 0 ? global.CellType.User1 : global.CellType.User2



    }
    else if(activatedSpellType == global.SpellType.Steal){
        print("Inside Grid Tapped Spell STEAL");
        print("spellFunctionalGrids.includes(gridIndex)" + spellFunctionalGrids.includes(gridIndex));
        print("spellFunctionalGrids   "+spellFunctionalGrids);


        if(spellFunctionalGrids.includes(gridIndex)){
            print("FunctionalSpell includes current grid");

            print("Current player : "+currentPlayer +"  grid[gridIndex]  : "+grid[gridIndex].owner);

            if(currentPlayer == 0 && grid[gridIndex].owner == global.CellType.User2){
                print("Current user is 0, and Tapped grid is occupied by Another user2");
                print("Previous grid : "+grid);
                
                //#####################
                //grid[gridIndex] = global.CellType.User1;
                await attachSpellToCell(gridIndex, global.SpellType.Steal, currentTurn+2);
                //#####################


                print("Updated grid : "+grid);
                script.spellManager.spellUsed(activatedSpellType);
                script.spellManager.activateSpell(activatedSpellType);

            }
            else if(currentPlayer == 1 && grid[gridIndex].owner == global.CellType.User1){
                print("Current user is 1, and Tapped grid is occupied by Another user1");
                print("Previous grid : "+grid);
                //grid[gridIndex].owner = global.CellType.User2;

                await attachSpellToCell(gridIndex, global.SpellType.Steal, currentTurn+2);



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

    await populateGrid()

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
   // print("highlightAllCells called, value = " + willHighlight);
    for (var i = 0 ; i < script.cells.length; i++){
        var cellScript = script.cells[i];
        //print("cell[" + i + "] script = " + cellScript);
        if (cellScript && cellScript.highlight) {
            //print(" -> calling highlight on cell " + i);
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
                if(grid[i].owner == global.CellType.User2){
                    highlightCell(i, true);
                }
            }
        }
        else{
            for(var i = 0; i< grid.length; i++){
                if(grid[i].owner == global.CellType.User1){
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
                if(grid[i].owner == global.CellType.User2){
                spellFunctionalGrids.push(i);
                highlightCell(i, true);
                }
            }
            else{
                if(grid[i].owner == global.CellType.User1){
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





async function attachSpellToCell(gridIndex, spellType, effectiveTurn) {
    // Get the current cell object
    //var cell = grid[gridIndex];

    // 1.. Create the spell effect object

    print("Spell " + spellType + " applied to cell " + gridIndex);


    var newSpellEffect = script.spellManager.getSpellDetails(spellType, currentTurn);
    

    print("Starting Animation Wait...");


    // 2. Show animation first
    await script.spellManager.showCastedSpellAnimation(spellType, gridIndex);

    print("Animation Finished, continuing with grid update...");


    // Use the central update function to add the spell and sync/populate
    await updateGridData(gridIndex, 'addSpell', newSpellEffect);


    //Insert the spell into the array
    //cell.spells.push(newSpellEffect);


     

    /*var st = script.cells[gridIndex]
    .getSceneObject()
    .getComponent("Component.ScreenTransform");

    var screenPos = st.localPointToWorldPoint(vec2.zero());

    print("gridIndex : "+gridIndex);
    print("grid position  : "+grid[gridIndex]);
    print("screenPos  : "+screenPos);*/





    //await script.spellManager.showCastedSpellAnimation(activatedSpellType, gridIndex);




    // 4. Update the turn-based system immediately
    //script.turnBased.setGlobalVariable("gridData", grid);
    
    // 5. Refresh visuals so the icon appears
    //populateGrid();
}