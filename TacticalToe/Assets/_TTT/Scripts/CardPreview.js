// @input Asset.ObjectPrefab draggablePrefab
// @input SceneObject handPosition

script.createEvent("TouchStartEvent").bind(function(eventData) {
    // 1. Spawn Object B at the hand position
    var newDraggable = script.draggablePrefab.instantiate(script.getSceneObject().getParent());
    newDraggable.getTransform().setWorldPosition(script.getTransform().getWorldPosition());
    
    // 2. Pass control to the draggable script
    var draggableScript = newDraggable.getComponent("Component.ScriptComponent");
    draggableScript.init(eventData.getTouchId(), script.getSceneObject());
});