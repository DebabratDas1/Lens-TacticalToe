print("CellTapTest: script loaded on " + script.getSceneObject().name);

function onTouchStart(eventData) {
    print("Touch start at: " + eventData.getTouchPosition());
    var obj = script.getSceneObject();
    print("Touched object: " + obj.name);
}

script.createEvent("TouchEndEvent").bind(onTouchStart);