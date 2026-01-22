//BoardController.js
//@input Component.ScriptComponent turnBased

//@input Asset.ObjectPrefab userCard
// @input SceneObject spawnParent
//@input SceneObject gridParent

var currentPlayer
var otherPlayer
var currentTurn
var positions = []
var xoArray = []
var grid = []


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

}

script.turnBased.onTurnStart.add(turnStarted)


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
        global.CellType.User1,
        global.CellType.None,
        global.CellType.User1,
        global.CellType.None,
        global.CellType.User2,
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


function gridTapped(gridIndex){
    print("gridIndex : "+gridIndex)

    if(grid[gridIndex] != 0){
        return;
    }


    grid[gridIndex] = currentPlayer == 0 ? global.CellType.User1 : global.CellType.User2

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

    script.turnBased.endTurn()


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



// NEED to remove Tween from Card Prefab, to position properly