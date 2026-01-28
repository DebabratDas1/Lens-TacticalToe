//Card.js

//@input Component.ScriptComponent turnBasedPlayerInfo

// @input Component.Image effectImage
// @input Asset.Texture stealTexture
// @input Asset.Texture freezeTexture
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
}

script.createEvent("OnStartEvent").bind(initMaterial);




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
    else{
         mat.mainPass.baseColor = new vec4(c.x, c.y, c.z, 0.0); // alpha 0
    }
    print("Show attached spell finished");
}

script.showAttchedSpell = showAttchedSpell;