// OptionsPanelController.js

// @input SceneObject panelRoot
// @input Component.ScreenTransform panelScreenTransform
// @input SceneObject[] optionButtons
// @input float horizontalSpacing = 0.30
// @input float verticalSpacing = 0.30

global.optionsPanelController = script;

// Example per-cell options, replace with your real data
var cellOptions = {
    0: ["A1", "A2", "A3", "A4", "A5"],
    1: ["B1", "B2", "B3", "B4", "B5"],
    2: ["C1", "C2", "C3", "C4", "C5"],
    3: ["D1", "D2", "D3", "D4", "D5"],
    4: ["E1", "E2", "E3", "E4", "E5"],
    5: ["F1", "F2", "F3", "F4", "F5"],
    6: ["G1", "G2", "G3", "G4", "G5"],
    7: ["H1", "H2", "H3", "H4", "H5"],
    8: ["I1", "I2", "I3", "I4", "I5"]
};

var lastCellIndex = -1;

script.showForCell = function (cellIndex, screenPos) {
    print("showForCell cell " + cellIndex + " at " + screenPos);

    if (!script.panelRoot || !script.panelScreenTransform) {
        print("OptionsPanelController: panelRoot or panelScreenTransform not set");
        return;
    }

    lastCellIndex = cellIndex;

    var opts = cellOptions[cellIndex];
    if (!opts) {
        script.panelRoot.enabled = false;
        return;
    }

    positionAndLayoutPanel(screenPos);

    script.panelRoot.enabled = true;
};

function positionAndLayoutPanel(screenPos) {
    // Decide if we want horizontal (above/below) or vertical (left/right)
    var absX = Math.abs(screenPos.x);
    var absY = Math.abs(screenPos.y);
    var orient;
    var side;

    if (absY >= absX) {
        // More “top/bottom” → horizontal row above or below
        orient = "horizontal";
        side = (screenPos.y > 0.0) ? "below" : "above";
    } else {
        // More “side” → vertical column left or right
        orient = "vertical";
        side = (screenPos.x > 0.0) ? "left" : "right";
    }

    // Base position from tap (already in [-1..1])
    var p = new vec3(screenPos.x, screenPos.y, 0);
    var offset = 0.45; // distance away from cell so we don't cover it

    switch (side) {
        case "above": p.y += offset; break;
        case "below": p.y -= offset; break;
        case "left":  p.x -= offset; break;
        case "right": p.x += offset; break;
    }

    // Clamp so it stays on screen
    p.x = Math.max(-0.75, Math.min(0.75, p.x));
    p.y = Math.max(-0.75, Math.min(0.75, p.y));

    // Move the panel’s ScreenTransform rect
    script.panelScreenTransform.position = p;
    print("Panel ScreenTransform.position now: " + script.panelScreenTransform.position);

    // Layout buttons inside the panel
    if (orient === "horizontal") {
        layoutHorizontal();
    } else {
        layoutVertical();
    }
}

function layoutHorizontal() {
    var n = script.optionButtons.length;
    if (!n) return;

    var spacing = script.horizontalSpacing;
    var halfSpan = (n - 1) * 0.5 * spacing;

    for (var i = 0; i < n; i++) {
        var btn = script.optionButtons[i];
        if (!btn) continue;

        var st = btn.getComponent("Component.ScreenTransform");
        if (!st) continue;

        var x = -halfSpan + i * spacing;
        st.position = new vec3(x, 0, 0);
    }
}

function layoutVertical() {
    var n = script.optionButtons.length;
    if (!n) return;

    var spacing = script.verticalSpacing;
    var halfSpan = (n - 1) * 0.5 * spacing;

    for (var i = 0; i < n; i++) {
        var btn = script.optionButtons[i];
        if (!btn) continue;

        var st = btn.getComponent("Component.ScreenTransform");
        if (!st) continue;

        var y = halfSpan - i * spacing; // top to bottom
        st.position = new vec3(0, y, 0);
    }
}