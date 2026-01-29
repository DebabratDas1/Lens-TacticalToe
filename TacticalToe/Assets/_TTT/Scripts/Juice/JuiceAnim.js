//@input Component.AudioComponent placeAudio;
//@input Component.PostEffectVisual shakeEffect;

function DoAnim(tweenObject){

    script.placeAudio.play(1);

    global.tweenManager.startTween(tweenObject, 'Test_Tween');

    enableForSeconds(0.6);
}

script.DoAnim = DoAnim;


function enableForSeconds(seconds) {
    // Enable now
    script.shakeEffect.enabled = true;

    // Create a delayed event
    var evt = script.createEvent("DelayedCallbackEvent");
    evt.bind(function () {
        // This runs after 'seconds'
        script.shakeEffect.enabled = false;
    });
    evt.reset(seconds); // delay in seconds
}


function shakeScreen(){
    enableForSeconds(0.6);
}

script.shakeScreen = shakeScreen;

