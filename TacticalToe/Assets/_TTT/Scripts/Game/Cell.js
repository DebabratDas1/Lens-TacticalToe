// Cell.js
// @input int cellIndex
//@input Component.ScriptComponent controller
//@input Component.ScriptComponent tweenAlpha


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


function highlight(willActive){
    print("Inside ====== cell highlight");
    print("Cell " + script.cellIndex + " highlight(" + willActive + ")");


    if(willActive){
        global.tweenManager.stopTween(script.getSceneObject(), 'GridAlphaLow');
        global.tweenManager.startTween(script.getSceneObject(), 'GridAlphaHigh')

    }
    else{
        print("Inside else of cell highlight that is disable highlight");
        global.tweenManager.stopTween(script.getSceneObject(), 'GridAlphaHigh')
        global.tweenManager.startTween(script.getSceneObject(), 'GridAlphaLow');

    }
    //print("  tweenAlpha.enabled = " + script.tweenAlpha.enabled);
    /*if (script.tweenAlpha) {
        script.tweenAlpha.enabled = willActive;
        print("  tweenAlpha.enabled = " + script.tweenAlpha.enabled);
    } else {
        print("  tweenAlpha not set on this cell");
    }*/
}

script.highlight = highlight
























