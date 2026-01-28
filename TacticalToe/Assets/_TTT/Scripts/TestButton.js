//@input Component.ScriptComponent juiceAnim;

//@input SceneObject tweenObject;


//@input Component.ScriptComponent optionKey1;


// ANIMATION HANDLER TEST
// @input Component.ScriptComponent animHandler
// @input Component.Image testImage;




async function onTap(){

    // CARD ANIMATION TEST
    /*print("Tapped : "+script.sceneObject.name);
    script.juiceAnim.DoAnim(script.tweenObject);*/



    // OPTION-KEY ANIMATION TEST
    //script.optionKey1.animateOption();

/*

    var mainPass = script.testImage.mainPass;
    var provider = (mainPass && mainPass.baseTex) ? mainPass.baseTex.control : null;

    await new Promise(function(resolve) {
        script.animHandler.playVideoAnimation(script.testImage, resolve);
    });

    script.testImage.getSceneObject().enabled = true;


    provider.play(1);

    print("Testing animation ....1");
    print("Testing animation ....2");
    print("Testing animation ....3");
    print("Testing animation ....4");


    provider.onPlaybackDone.add(finish);

*/

//script.animHandler.playVideoAnimation(script.testImage);
await new Promise(function(resolve) {
        script.animHandler.playVideoAnimation(script.testImage, resolve);
    });
print("When it is being printed");

}

script.createEvent("TapEvent").bind(onTap);