// EndTurnButton.js
// @input Component.ScriptComponent boardController   // BoardController.js ScriptComponent

function onTap(eventData) {
    if (script.boardController && script.boardController && script.boardController.endTurnSafely) {
        script.boardController.endTurnSafely();
    } else {
        print("EndTurnButton: boardController.api.endTurnSafely not set");
    }
}

script.createEvent("TapEvent").bind(onTap);