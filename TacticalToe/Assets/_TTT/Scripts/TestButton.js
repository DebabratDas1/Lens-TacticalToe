//@input Component.ScriptComponent juiceAnim;

//@input SceneObject tweenObject;

function onTap(){
    print("Tapped : "+script.sceneObject.name);
    script.juiceAnim.DoAnim(script.tweenObject);
}

script.createEvent("TapEvent").bind(onTap);