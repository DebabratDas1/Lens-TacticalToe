//@input vec4 upBounds
//@input vec4 downBounds
 var isUp = false;


function tweenUp() {

    // Start and end value for position TO UP
    /*global.tweenManager.setStartValue(
        script.getSceneObject(),
        'OptionUpDown',
        script.downBounds
    );
    global.tweenManager.setEndValue(
        script.getSceneObject(),
        'OptionUpDown',
        script.upBounds
    );*/
    global.tweenManager.startTween(script.getSceneObject(), 'OptionUp', moveComplete);


    // Start and end value for Highlight start
   /* global.tweenManager.setStartValue(
        script.getSceneObject(),
        'OptionAlpha',
        0.0
    );
    global.tweenManager.setEndValue(
        script.getSceneObject(),
        'OptionAlpha',
        1.0
    );*/
    global.tweenManager.startTween(script.getSceneObject(), 'OptionAlphaHigh');

}

function moveComplete() {
    isUp = !isUp;
    //global.tweenManager.pauseTween(script.getSceneObject(), 'OptionUpDown');
  
}


function animateOption(){
    if(isUp){
        tweenDown()
    }
    else{
        tweenUp()
    }
}

function tweenDown() {
    // from end → start
    /*global.tweenManager.setStartValue(
        script.getSceneObject(),
        'OptionUpDown',
        script.upBounds
    );
    global.tweenManager.setEndValue(
        script.getSceneObject(),
        'OptionUpDown',
        script.downBounds
    );*/
    global.tweenManager.startTween(script.getSceneObject(), 'OptionDown', moveComplete);


    /*global.tweenManager.setStartValue(
        script.getSceneObject(),
        'OptionAlpha',
        1.0
    );
    global.tweenManager.setEndValue(
        script.getSceneObject(),
        'OptionAlpha',
        0.0
    );*/
    global.tweenManager.startTween(script.getSceneObject(), 'OptionAlphaLow');
}

// Expose for other scripts / buttons
script.tweenUp = tweenUp;
script.tweenDown = tweenDown;
script.animateOption = animateOption;


function onTap(){
    print("Clicked on : "+script.getSceneObject().name);

    script.spellManager.activateSpell(script.spellTypeNumber);
}

script.createEvent("TapEvent").bind(onTap);


//@input Component.ScriptComponent spellManager;
//@input int spellTypeNumber;

