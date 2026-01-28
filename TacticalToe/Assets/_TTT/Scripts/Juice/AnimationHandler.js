// AnimationHandler.js

/*function playVideoAnimation(screenImage, onComplete) {
    if (!screenImage) {
        if (onComplete) onComplete();
        return;
    }

    var mainPass = screenImage.mainPass;
    var provider = (mainPass && mainPass.baseTex) ? mainPass.baseTex.control : null;

    // Basic feature check
    if (!provider || typeof provider.play !== "function" || !provider.onPlaybackDone) {
        if (onComplete) onComplete();
        return;
    }

    var so = screenImage.getSceneObject();
    so.enabled = true;
    screenImage.enabled = true;

    var finished = false;
    function finish() {
        if (finished) return;
        finished = true;

        try { provider.stop && provider.stop(); } catch (e) {}

        screenImage.enabled = false;
        so.enabled = false;

        if (onComplete) {
            onComplete();
        }
    }

    // 1) Normal completion
    provider.onPlaybackDone.add(finish);

    // 2) Failsafe: if onPlaybackDone never fires
    var maxWait = provider.totalDuration > 0 ? provider.totalDuration + 0.5 : 5.0;
    var failsafe = script.createEvent("DelayedCallbackEvent");
    failsafe.bind(function () {
        finish();
        script.removeEvent(failsafe);
    });
    failsafe.reset(maxWait);

    // 3) Just try to play once from the beginning, regardless of isPlaybackReady
    try {
        provider.stop && provider.stop();   // reset
        provider.seek && provider.seek(0);  // start at 0s
        provider.play(1);                   // play exactly once
    } catch (e) {
        // If play/seek throws (unprepared state), we still let failsafe call finish()
    }
}*/


// AnimationHandler.js
function playVideoAnimation(screenImage, onComplete) {

    var mainPass = screenImage.mainPass;
    var provider = (mainPass && mainPass.baseTex) ? mainPass.baseTex.control : null;


    provider.onPlaybackDone.add(finish);

    function finish(){
        // 3. Execute the callback (note the parentheses!)

        if (onComplete) {

            onComplete(); 
            screenImage.getSceneObject().enabled = false;


        }

        else{
            // 2. Disable the object
            print("Playback finished inside anim handler");


            screenImage.getSceneObject().enabled = false;


        }

    }



        

     screenImage.getSceneObject().enabled = true;


     provider.play(1);







    
}

script.playVideoAnimation = playVideoAnimation;



/*
// AnimationHandler.js
function playVideoAnimation(screenImage, onComplete) {
    if (!screenImage) {
        if (onComplete) onComplete();
        return;
    }

    var mainPass = screenImage.mainPass;
    var provider = (mainPass && mainPass.baseTex) ? mainPass.baseTex.control : null;

    if (!provider || !(provider instanceof VideoTextureProvider)) {
        print("AnimationHandler: Error - No VideoTextureProvider found!");
        if (onComplete) onComplete();
        return;
    }

    var isFinished = false;

    // The function that runs when playback ends
    var wrapComplete = function() {
        if (isFinished) return;
        isFinished = true;

        print("Playback finished");
        
        // Safety: try/catch prevent "Value is not a native object" errors
        try { provider.onPlaybackDone.remove(wrapComplete); } catch(e) {}

        screenImage.getSceneObject().enabled = false;

        if (onComplete) {
            onComplete(); 
        } else {
            print("Playback finished inside anim handler");
        }
    };

    // 1. Add the listener
    provider.onPlaybackDone.add(wrapComplete);

    // 2. FAILSAFE: If the video fails to fire the event, force finish after 3 seconds
    var failsafe = script.createEvent("DelayedCallbackEvent");
    failsafe.bind(function() {
        if (!isFinished) {
            print("AnimationHandler: Failsafe triggered (Event missed)");
            wrapComplete();
        }
    });
    failsafe.reset(3.0); 

    // 3. Prepare and Play
    screenImage.getSceneObject().enabled = true;

    // Resetting the state is crucial. If the video is already at the end, 
    // play(1) might not trigger the 'Done' event again.
    provider.stop(); 
    provider.play(1);
    
    print("AnimationHandler: Play(1) called");
}

script.playVideoAnimation = playVideoAnimation;
*/