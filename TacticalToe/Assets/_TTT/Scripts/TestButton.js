//@input Component.ScriptComponent juiceAnim;

//@input SceneObject tweenObject;


//@input Component.ScriptComponent optionKey1;


function onTap(){

    // CARD ANIMATION TEST
    /*print("Tapped : "+script.sceneObject.name);
    script.juiceAnim.DoAnim(script.tweenObject);*/



    // OPTION-KEY ANIMATION TEST
    script.optionKey1.animateOption();
}

script.createEvent("TapEvent").bind(onTap);