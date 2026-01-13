// Cell.js
// @input int cellIndex

function onTouchEnd(eventData) {
    var p = eventData.getTouchPosition(); // 0..1
    // Convert [0..1] → [-1..1]
    var screenPos = new vec2(p.x * 2.0 - 1.0, p.y * 2.0 - 1.0);

    print("Touch end at raw: " + p + " mapped: " + screenPos);

    if (global.optionsPanelController && global.optionsPanelController.showForCell) {
        global.optionsPanelController.showForCell(script.cellIndex, screenPos);
    } else {
        print("optionsPanelController not ready");
    }
}

script.createEvent("TouchEndEvent").bind(onTouchEnd);