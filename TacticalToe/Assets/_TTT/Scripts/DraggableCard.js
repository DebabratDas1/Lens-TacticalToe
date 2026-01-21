// @input float smoothSpeed = 0.15

var touchId;
var originObject; // Object A
var isDropped = false;

script.init = function(id, origin) {
    touchId = id;
    originObject = origin;
};

script.createEvent("UpdateEvent").bind(function() {
    if (isDropped) return;

    // Follow finger logic (Screen to World)
    var touchPos = screen.getTouchPosition(touchId);
    // You'll need a helper to project this to the 3D plane of your board
    var worldPos = script.getSceneObject().getComponent("Component.Camera").screenToWorldPoint(touchPos, 10); 
    script.getTransform().setWorldPosition(worldPos);
});

script.createEvent("TouchEndEvent").bind(function(eventData) {
    if (eventData.getTouchId() !== touchId) return;

    var targetCell = checkOverlapWithCells(); // Function to detect if over a valid TicTacToe cell

    if (targetCell && !targetCell.isOccupied) {
        // Spawn Object C at targetCell position
        targetCell.spawnCardC();
        script.getSceneObject().destroy();
    } else {
        // Snap back to Object A then destroy
        animateBackToOrigin();
    }
});

function animateBackToOrigin() {
    // Use an orthographic tween or simple interpolation back to originObject position
    // After animation:
    // script.getSceneObject().destroy();
}