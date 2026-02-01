// EndTurnButton.js
// @input Component.ScriptComponent boardController   // BoardController.js ScriptComponent

function onTap(eventData) {
    if (script.boardController && script.boardController.endTurnSafely) {
        if (!script.boardController.canEndTurn()) {
        print("Cannot end turn yet — must place or cast");
        // Optional: show message "You must make a move!"
        return;
    }
        script.boardController.endTurnSafely();
    } else {
        print("EndTurnButton: boardController.api.endTurnSafely not set");
    }
}

script.createEvent("TapEvent").bind(onTap);