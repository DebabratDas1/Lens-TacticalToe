
//@input Component.ScriptComponent turnBased

//    @input Asset.ObjectPrefab[] xo
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