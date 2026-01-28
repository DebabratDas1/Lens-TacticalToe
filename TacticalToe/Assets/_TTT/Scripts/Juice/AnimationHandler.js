// AnimationHandler.js

function playVideoAnimation(screenImage, onComplete) {
    print("--- AnimationHandler: playVideoAnimation Called ---");
    
    var isFinished = false;
    var wrapComplete = function() {
        if (isFinished) return;
        isFinished = true;
        print("Step 4: wrapComplete triggered.");
        screenImage.enabled = false;
        if (onComplete) onComplete();
    };

    // --- CRITICAL FAILSAFE ---
    // Start the timer IMMEDIATELY. If Step 2, 3, or 5 fails, the game continues.
    var failsafe = script.createEvent("DelayedCallbackEvent");
    failsafe.bind(wrapComplete);
    failsafe.reset(2.0); 

    if (!screenImage) {
        print("!!! Error: screenImage NULL");
        wrapComplete();
        return;
    }

    try {
        var mainPass = screenImage.mainPass;
        var tex = mainPass ? mainPass.baseTex : null;
        
        if (!tex) {
            print("!!! Error: No Texture");
            wrapComplete();
            return;
        }

        print("Step 1.5: Texture name: " + tex.name);

        // Access the control/provider
        var provider = tex.control;
        
        // Detailed check: Is it actually the right type?
        if (provider) {
            print("Step 2: Provider exists. Attempting playback...");
            
            // Register listener if possible
            if (provider.onPlaybackDone) {
                provider.onPlaybackDone.add(wrapComplete);
            }

            screenImage.enabled = true;
            provider.stop();
            provider.play(1);
            print("Step 5: Play called.");
        } else {
            print("!!! Error: No Provider found on " + tex.name);
            wrapComplete();
        }

    } catch (err) {
        print("!!! AnimationHandler CRASHED: " + err);
        wrapComplete(); // Resolve promise even if code breaks
    }
}

script.playVideoAnimation = playVideoAnimation;