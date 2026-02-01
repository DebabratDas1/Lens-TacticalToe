//Card.js

//@input Component.ScriptComponent turnBasedPlayerInfo
//@input Component.ScreenTransform cardScreenTransform

//@input vec4 animStartBounds



// @input Component.Image effectImage
// @input Asset.Texture stealTexture
// @input Asset.Texture shieldTexture
// @input Asset.Texture spell3Texture
// @input Asset.Texture spell4Texture
// @input Asset.Texture defaultTexture



var localMat = null;


function initMaterial() {
    if (!script.effectImage) {
        print("Card: effectImage not set");
        return;
    }
    // Clone shared material so this card has its own copy
    localMat = script.effectImage.mainMaterial.clone();
    script.effectImage.mainMaterial = localMat;


    //var c = localMat.mainPass.baseColor; 
    //localMat.mainPass.baseColor = new vec4(c.x, c.y, c.z, 0.0); // alpha 0
    //localMat.mainPass.baseTex = script.defaultTexture;
}

script.createEvent("OnStartEvent").bind(initMaterial);


var baseSize = null;

function initCardSize() {
    if (!script.cardScreenTransform) {
        print("Card: cardScreenTransform not set");
        return;
    }
    // This is the prefab’s designed size (relative to its parent)
    baseSize = script.cardScreenTransform.anchors.getSize();
    print("Cached baseSize: " + baseSize.toString());
}

script.createEvent("OnStartEvent").bind(initCardSize);



async function setTargetUser(targetUser) {

    print("Inside SetTragetUser"+targetUser);
    if (!script.turnBasedPlayerInfo) {
        print("TurnBasedPlayerInfo not set");
        return;
    }

    print(script.turnBasedPlayerInfo.turnBased);
    print("Trarget user : "+targetUser);

    const user = await script.turnBasedPlayerInfo.turnBased.getUser(targetUser); // 0 or 1
    await script.turnBasedPlayerInfo.setSnapchatUser(user);

    const currentTarget = await script.turnBasedPlayerInfo.getTargetUser();
    print("script.turnBasedPlayerInfo.userType  :  "+currentTarget);
}

script.setTargetUser = setTargetUser;

function onTouchEnd(eventData) {
    print(script.getSceneObject().getComponent("Component.ScreenTransform").anchors.getCenter())
}

script.createEvent("TouchEndEvent").bind(onTouchEnd);


function getName(){
    return script.getSceneObject().name;
}

script.getName = getName;


function showAttchedSpell(spellType){

    if (!localMat) {
        // fallback if init didn't run yet
        initMaterial();
        if (!localMat) return;
    }

    var mat = script.effectImage.mainMaterial;
    var c = mat.mainPass.baseColor; 
    mat.mainPass.baseColor = new vec4(c.x, c.y, c.z, 0.6); // alpha 1
    if(spellType == global.SpellType.Steal){
         mat.mainPass.baseTex = script.stealTexture;



    }
    else if(spellType == global.SpellType.Shield){
         mat.mainPass.baseTex = script.shieldTexture;



    }
    else{

         mat.mainPass.baseColor = new vec4(c.x, c.y, c.z, 0.0); // alpha 0
         mat.mainPass.baseTex = script.defaultTexture;
    }
    print("Show attached spell finished");
}

script.showAttchedSpell = showAttchedSpell;



// Card Placement Animation

function playCardPlacingAnim(endingCenter){
print("Inside play card anim");
var st = script.cardScreenTransform;

if (!baseSize) {
        baseSize = st.anchors.getSize();
        print("Lazy-cached baseSize: " + baseSize.toString());
    }


    // 1) START RECT: from animStartBounds (L, R, B, T)
    var startRect = Rect.create(
        script.animStartBounds.x, // left
        script.animStartBounds.y, // right
        script.animStartBounds.z, // bottom
        script.animStartBounds.w  // top
    );

    print("Rect.create invoked");

    // Apply it so the card visually starts here
    st.anchors = startRect;

    print("st.anchors set");

    // 2) END RECT: same size as prefab (baseSize), centered at endingCenter
    var halfWidth  = baseSize.x * 0.5;
    var halfHeight = baseSize.y * 0.5;

    print("halfWidth");

    var endRect = Rect.create(
        endingCenter.x - halfWidth, // left
        endingCenter.x + halfWidth, // right
        endingCenter.y - halfHeight,// bottom
        endingCenter.y + halfHeight // top
    );
print("End rect set");
    // 3) Pack rects into vec4 in the correct order: (L, R, B, T)
    var startBounds = new vec4(
        startRect.left,
        startRect.right,
        startRect.bottom,
        startRect.top
    );
print("start bounds from vec4");


    var endingBounds = new vec4(
        endRect.left,
        endRect.right,
        endRect.bottom,
        endRect.top
    );

    print("Start bounds:  " + startBounds.toString());
    print("End bounds:    " + endingBounds.toString());

    /*
var rect = st.anchors;  

              // Rect
    var size = rect.getSize();           // vec2(width, height)
    var halfWidth  = size.x * 0.5;
    var halfHeight = size.y * 0.5;

    // Start bounds (current rect)
    var startBounds = new vec4(
        rect.left,
        rect.top,
        rect.right,
        rect.bottom
    );

    print("Start bounds: " + startBounds.toString());

    // End bounds: same size, new center
    var endingBounds = new vec4(
        endingCenter.x - halfWidth,
        endingCenter.y + halfHeight,
        endingCenter.x + halfWidth,
        endingCenter.y - halfHeight
    );

    print("Ending bounds: " + endingBounds.toString());

//var newStart = new vec3(0.0, 0.0, 0.0);

*/
global.tweenManager.setStartValue(script.getSceneObject(), 'placeCard', startBounds);

global.tweenManager.setEndValue(script.getSceneObject(), 'placeCard', endingBounds);

global.tweenManager.startTween(script.getSceneObject(), 'placeCard');

print("Anim finished");
}


script.playCardPlacingAnim = playCardPlacingAnim;

