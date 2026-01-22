// Cell.js
// @input int cellIndex
//@input Component.ScriptComponent controller


// Enum
global.CellType = {
        None   : 0,
        User1  : 1,
        User2  : 2,
        Freeze : 3,
        Custom1: 4,
        Custom2: 5
    };




script.cellType = global.CellType.None;

function onTouchEnd(eventData) {
    var p = eventData.getTouchPosition(); // 0..1
    // Convert [0..1] -> [-1..1]
    var screenPos = new vec2(p.x * 2.0 - 1.0, p.y * 2.0 - 1.0);

    print("Clicked cell index " + script.cellIndex);
    print("Cell Type : "+ script.cellType);
    print(script.getSceneObject().getComponent("Component.ScreenTransform").anchors.getCenter())

    script.controller.gridTapped(script.cellIndex)
}

script.createEvent("TouchEndEvent").bind(onTouchEnd);
























