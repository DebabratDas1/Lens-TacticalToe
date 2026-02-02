//SpellManager.js

global.SpellType = {
        None : 0,
        Steal   : 1,
        Shield  : 2,
        Poison  : 3,
        Purifier : 4,
        Spell5: 5,
        Spell6: 6
    };


    //@input Component.ScriptComponent turnBased;

    //@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Other Script References"}
//@input Component.ScriptComponent boardController
// @input Component.ScriptComponent animHandler
// @input Component.ScriptComponent juice;
// @input Component.ScriptComponent spellBook;
// @input Component.ScriptComponent opponentUi;




//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Below Spell Options Keys"}
//@input Component.ScriptComponent stealOptionKey
//@input Component.ScriptComponent shieldOptionKey
//@input Component.ScriptComponent poisonOptionKey
//@input Component.ScriptComponent spell3OptionKey




//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Morph Spell References"}
//@input Component.Image morphCastedEffectImage;
//@input Component.Image morphActioningEffectImage;
//@input Component.ScriptComponent morphPositionSetScript;
//@input Component.ScriptComponent morphActionScript;


//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Shield Spell References"}
//@input Component.Image shieldCastedEffectImage;
//@input Component.ScriptComponent shieldPositionSetScript;
//@input Component.Image shieldActioningEffectImage;
//@input Component.ScriptComponent shieldActionSetPositionScript;

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Poison Spell References"}
//@input Component.Image poisonCastedEffectImage;
//@input Component.ScriptComponent poisonPositionSetScript;
//@input Component.Image poisonActioningEffectImage;
//@input Component.ScriptComponent poisonActionSetPositionScript;

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Purifier Spell References"}
//@input Component.Image purifierCastedEffectImage;
//@input Component.ScriptComponent purifierPositionSetScript;
/*
//@input Component.Image purifierActioningEffectImage;
//@input Component.ScriptComponent purifierActionSetPositionScript;
*/


//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Current Player Available Spells"}
//@input Component.Text morphAvailableNoTextCurrentPlayer
//@input Component.Text shieldAvailableNoTextCurrentPlayer
//@input Component.Text poisonAvailableNoTextCurrentPlayer
//@input Component.Text purifyerAvailableNoTextCurrentPlayer

//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"Other Player Available Spells"}
//@input Component.Text morphAvailableNoTextOtherPlayer
//@input Component.Text shieldAvailableNoTextOtherPlayer
//@input Component.Text poisonAvailableNoTextOtherPlayer
//@input Component.Text purifyerAvailableNoTextOtherPlayer








//@ui {"widget":"separator"}

//@input Component.Image fireCastedEffectImage;




    var isSpellActivate = false;
    var activatedSpellType = SpellType.None;
    var availableSpell; // = [2,2,2,2,2]   // 0. steal, 1. Spell2, 2. Spell3, 3. Spell4
    var otherPlayerAvailableSpell;
    var currentPlayer;
    var otherPlayer;
    var currentTurn;


    async function turnStarted(_currentPlayer, _otherPlayer, _currentTurn){

        ("Inside SpellManager Turn Started");
        currentPlayer = _currentPlayer;
        print("Current Player = "+currentPlayer);
        otherPlayer = _otherPlayer;
        print("Other Player = "+otherPlayer);

        currentTurn = _currentTurn;
        print("currentTurn  = "+currentTurn);



        await getAvailableSpells(currentPlayer);
        await getOtherPlayerAvailableSpells(otherPlayer);

    }

    script.turnStarted = turnStarted;


    async function getAvailableSpells(playerNo){
        print("Inside getAvailble spells");
       availableSpell =  await script.turnBased.getUserVariable(playerNo, "availableSpells");
       if(availableSpell == undefined){
            availableSpell = [2,2,2,2,2];
       }
            if(script.morphAvailableNoTextCurrentPlayer) script.morphAvailableNoTextCurrentPlayer.text = availableSpell[0].toString();
            if(script.shieldAvailableNoTextCurrentPlayer) script.shieldAvailableNoTextCurrentPlayer.text = availableSpell[1].toString();
            if(script.poisonAvailableNoTextCurrentPlayer) script.poisonAvailableNoTextCurrentPlayer.text = availableSpell[2].toString();
            if(script.purifyerAvailableNoTextCurrentPlayer) script.purifyerAvailableNoTextCurrentPlayer.text = availableSpell[3].toString();
            print("available spells of user : "+ playerNo +" is : "+ availableSpell);
    }

    async function setAvailableSpells(){
        print("Insid set available spells of current user : "+ availableSpell);

        await script.turnBased.setUserVariable(currentPlayer, "availableSpells", availableSpell);
        if(script.morphAvailableNoTextCurrentPlayer) script.morphAvailableNoTextCurrentPlayer.text = availableSpell[0].toString();
            if(script.shieldAvailableNoTextCurrentPlayer) script.shieldAvailableNoTextCurrentPlayer.text = availableSpell[1].toString();
            if(script.poisonAvailableNoTextCurrentPlayer) script.poisonAvailableNoTextCurrentPlayer.text = availableSpell[2].toString();
            if(script.purifyerAvailableNoTextCurrentPlayer) script.purifyerAvailableNoTextCurrentPlayer.text = availableSpell[3].toString();
            print("available spells of user : "+ playerNo +" is : "+ availableSpell);

    }

    async function getOtherPlayerAvailableSpells(otherPlayer){
       otherPlayerAvailableSpell =  await script.turnBased.getUserVariable(otherPlayer, "availableSpells");
       if(otherPlayerAvailableSpell == undefined){
            otherPlayerAvailableSpell = [2,2,2,2,2];
       }
            if(script.morphAvailableNoTextOtherPlayer) script.morphAvailableNoTextOtherPlayer.text = otherPlayerAvailableSpell[0].toString();
            if(script.shieldAvailableNoTextOtherPlayer) script.shieldAvailableNoTextOtherPlayer.text = otherPlayerAvailableSpell[1].toString();
            if(script.poisonAvailableNoTextOtherPlayer) script.poisonAvailableNoTextOtherPlayer.text = otherPlayerAvailableSpell[2].toString();
            if(script.purifyerAvailableNoTextOtherPlayer) script.purifyerAvailableNoTextOtherPlayer.text = otherPlayerAvailableSpell[3].toString();
       print("available spells of other user : "+ otherPlayerAvailableSpell);
       if(currentTurn > 0){
            script.opponentUi.setOpponentSpellNos(otherPlayerAvailableSpell);
       }
    }





    function activateSpell(spellType){

        print("Received Spell Type = "+spellType)
        print("isSpellActivate = "+isSpellActivate)



        // 1. Any Spell is activated, that is isSpellActivate = true
               // If Received SpellType is same as activated spell type, then isSpellActivate = false
               // If Received SpellType is not same as activated spell type, then change spelltype depending on availability
        // 2. 

        if(isSpellActivate){
            print("Inside Spell Is Already Activated");
            // Deactivate Activate Spell
            if(activatedSpellType == spellType){
            print("Inside Deactivate Spell");

                isSpellActivate = false;
            print("Spell Deactivated");
            print("Stop highlighting all cells");


                animateOptionKeys(activatedSpellType);
                print("Should be down the current activated option");

                activatedSpellType = SpellType.None;
                print("Activated Spell Set to NONE");
                script.boardController.handleSpell(activatedSpellType);



                // TODO : Need to change animation of Option Key
            }

            // Change Activated Spell
            else{
                animateOptionKeys(activatedSpellType)

                if(isSpellAvailable(spellType)){
                    activatedSpellType = spellType;
                    animateOptionKeys(activatedSpellType)
                    //script.boardController.highlightAllCells(false);
                    script.boardController.handleSpell(activatedSpellType);

                }
                else{
                    isSpellActivate = false;
                    activatedSpellType = SpellType.None;
                    print("Activated Spell Set to NONE ^^^^");
                    script.boardController.handleSpell(activatedSpellType);
                }
                



                // TODO : Need to change animation of Option Key

            }

        }

        else{
            print("Inside Spell activated is false");
/*
            isSpellActivate = true;
            activatedSpellType = spellType;
            animateOptionKeys(activatedSpellType)

            //script.boardController.highlightAllCells(false);
            script.boardController.handleSpell(activatedSpellType);

            // TODO : Need to change animation of Option Key
*/

            if(isSpellAvailable(spellType)){
                    isSpellActivate = true;
                    activatedSpellType = spellType;
                    animateOptionKeys(activatedSpellType)
                    //script.boardController.highlightAllCells(false);
                    script.boardController.handleSpell(activatedSpellType);

                }
                else{
                    isSpellActivate = false;
                    activatedSpellType = SpellType.None;
                    print("Activated Spell Set to NONE ^^^^");
                    script.boardController.handleSpell(activatedSpellType);
                }

        }

        // SHOW SPELL BOOK
        script.spellBook.showSpellbook(activatedSpellType);

    }




script.activateSpell = activateSpell;


async function spellUsed(spellType){

    if(spellType == global.SpellType.Steal){
        print("Before use steal spell = "+availableSpell[0]);
        availableSpell[0] = availableSpell[0]-1;
        print("After use steal spell = "+availableSpell[0]);


    }
    else if(spellType == global.SpellType.Shield){
        print("Before use steal spell = "+availableSpell[1]);
        availableSpell[1] = availableSpell[1]-1;
        print("After use steal spell = "+availableSpell[1]);


    }
    else if(spellType == global.SpellType.Poison){
        print("Before use steal spell = "+availableSpell[2]);
        availableSpell[2] = availableSpell[2]-1;
        print("After use steal spell = "+availableSpell[2]);


    }
    else if(spellType == global.SpellType.Purifier){
        print("Before use steal spell = "+availableSpell[3]);
        availableSpell[2] = availableSpell[2]-1;
        print("After use steal spell = "+availableSpell[3]);


    }
    else{
        print("Some error occurred to determine Spell used ");
    }



    await setAvailableSpells();

}

script.spellUsed = spellUsed;

function isSpellAvailable(spellType){
    var currentAvailable = 0;
    if(spellType == global.SpellType.Steal){
        currentAvailable = availableSpell[0];
    }
    else if(spellType == global.SpellType.Shield){
        currentAvailable = availableSpell[1]
    }
    else if(spellType == global.SpellType.Poison){
        currentAvailable = availableSpell[2]
    }
    else if(spellType == global.SpellType.Purifier){
        currentAvailable = availableSpell[3]
    }
    else{
        print("Something error occurred");
    }
    if(currentAvailable > 0){
        return true;
    }
    else{
        return false;
    }
}


function animateOptionKeys(spellType){
    print("Inside Animate Option Keys of SpellManager");
    print("Received Spell Type  :  "+spellType);

    if(spellType == SpellType.Steal){
        script.stealOptionKey.animateOption();
    }
    else if(spellType == SpellType.Shield){
        script.shieldOptionKey.animateOption();
    }
    else if(spellType == SpellType.Poison){
        script.poisonOptionKey.animateOption();
    }
    else if(spellType == SpellType.Purifier){
        script.spell3OptionKey.animateOption();
    }
    else{
        print("Something Wrong Occurred To animate Spell Option Keys");
    }

}


function HighlightFunctionalGrids(){

}


function getSpellDetails(spellType, currentTurn){
    var newSpellEffect;

    if(spellType == global.SpellType.Steal){
        newSpellEffect = {
        "type": spellType,
        "caster": currentPlayer,
        "appliedTurn" : currentTurn,
        "effectiveTurn" : currentTurn+2,
        "effectiveUser" : currentPlayer,

        //"duration": 2 // Set duration based on the spell type
        };

    }

    if(spellType == global.SpellType.Steal){
        newSpellEffect = {
        "type": spellType,
        "caster": currentPlayer,
        "appliedTurn" : currentTurn,
        "effectiveTurn" : currentTurn+2,
        "effectiveUser" : currentPlayer,

        //"duration": 2 // Set duration based on the spell type
        };

    }
    else if(spellType == global.SpellType.Shield){
        newSpellEffect = {
        "type": spellType,
        "caster": currentPlayer,
        "appliedTurn" : currentTurn,
        "effectiveTurn" : currentTurn+2,
        "effectiveUser" : currentPlayer,

        //"duration": 2 // Set duration based on the spell type
        };

    }
    else if(spellType == global.SpellType.Poison){
        newSpellEffect = {
        "type": spellType,
        "caster": currentPlayer,
        "appliedTurn" : currentTurn,
        "effectiveTurn" : currentTurn+2,
        "effectiveUser" : currentPlayer,
        };

    }

    else if(spellType == global.SpellType.Purifier){
        newSpellEffect = {
        "type": spellType,
        "caster": currentPlayer,
        "appliedTurn" : currentTurn,
        "effectiveTurn" : currentTurn,
        "effectiveUser" : currentPlayer,
        };

    }
    else{
        print("Some error occured to getSpellDetails");
    }

    return newSpellEffect;
    
}

script.getSpellDetails = getSpellDetails;


async function processAttchedSpell(cardToApply, spell, gridindex){
    var spellType = spell.type;
    var caster = spell.caster;
    var effectiveTurn = spell.effectiveTurn;
    var effectiveUser = spell.effectiveUser;
    var appliedTurn = spell.appliedTurn;
    print("Inside process attched spell in SpellManager, spell = "+spell);
    print("spell.caster = "+caster);
    print("currentPlayer = "+currentPlayer);
    print("CurrentTurn : "+currentTurn);
    print("effectiveTurn : "+effectiveTurn);
    print("appliedTurn : "+appliedTurn);






    if(effectiveTurn == currentTurn && effectiveUser == currentPlayer){
        // Need to Action
        //Need to call BoardController's Function
        print("Trying to perform action");
        await performSpellAction(spell, gridindex);
    }
    else if(effectiveTurn > currentTurn){
        // Apply Attached Effect
        print("Inside attached effect");
        cardToApply.showAttchedSpell(spellType);
    }
    else{
        print("Some error occurred to processAttachedSpell");
    }
}
script.processAttchedSpell = processAttchedSpell;

// 1. Spell Casted Effects
// 2. Spell Applied Cell Effects
// 3. Spell is working effect

async function showCastedSpellAnimation(spellType, gridIndex){
    print("Inside showCastedSpellAnimation");
    var effectToApply;
    var positionScript = null;
    if(spellType == global.SpellType.Steal){
        effectToApply = script.morphCastedEffectImage;
        positionScript = script.morphPositionSetScript;
    }
    else if(spellType == global.SpellType.Shield){
        effectToApply = script.shieldCastedEffectImage;
        positionScript = script.shieldPositionSetScript;


    }
    else if(spellType == global.SpellType.Poison){
        effectToApply = script.poisonCastedEffectImage;
        positionScript = script.poisonPositionSetScript;


    }
    else if(spellType == global.SpellType.Purifier){
        effectToApply = script.purifierCastedEffectImage;
        positionScript = script.purifierPositionSetScript;


    }
    else{
        print("ERROR to get casted effect image for : "+spellType);
    }
    //print("Setting center"+position);
    //var so = effectToApply.getSceneObject();
    //var st = so.getComponent("Component.ScreenTransform");

    //snapTo(position, st);
    //var parentPointForB = st.worldPointToParentPoint(position); // -1..1
    //st.anchors.setCenter(parentPointForB);
    //if (!st) {
    //    print("SpellManager: effect image has no ScreenTransform");
     //   return;
    //}

    print("Trying to set cast effect position");

    positionScript.setPosition(gridIndex);

    //print("Setting center " + JSON.stringify(position));
    //st.anchors.setCenter(position);
    print("Done Setting center");

    effectToApply.getSceneObject().enabled = true;
    //so.enabled = true;




    print("Animation starting...");

    await new Promise(function(resolve) {
        
        // We create an anonymous function to act as the 'onComplete'
        script.animHandler.playVideoAnimation(effectToApply, function() {
            

            // 1. Put your custom "onComplete" code here
            print("Video finished! Now doing custom logic...");
            //script.testImage.getSceneObject().enabled = false; 

            // 2. Call resolve() to tell the 'await' it can continue
            resolve();
        });

    });

    script.juice.shakeScreen();



    // 3. This code runs only AFTER resolve() is called above
    print("Now executing the code after the await.");
    
    print("SpellManager: showCastedSpellAnimation complete.");


}


script.showCastedSpellAnimation = showCastedSpellAnimation;


function snapTo(cardWorldCenter, effectSt) {
    // 1) Get card's visual center in screen space (0..1,0..1)
    //var cardScreenPos = cardSt.localPointToScreenPoint(vec2.zero());

    // 2) Convert that screen pos into effect's parent anchor space (-1..1)
    var effectWorldCenter  = effectSt.localPointToWorldPoint(vec2.zero());



        // 3) Move effect SceneObject so centers match
        var effectTransform = effectSt.getSceneObject().getTransform();
        var currentWorldPos = effectTransform.getWorldPosition();

    
        // delta = how much to move the object so its center reaches card center
        var delta = cardWorldCenter.sub(effectWorldCenter);
        var newWorldPos = currentWorldPos.add(delta);

         effectTransform.setWorldPosition(newWorldPos);

         /*
    
    // 3) Zero out offsets and basic position so only anchors define the rect
    var off = effectSt.offsets;
    off.left = 0;
    off.right = 0;
    off.top = 0;
    off.bottom = 0;
    effectSt.offsets = off;

    effectSt.position = new vec3(0, 0, 0);  // basic position
    effectSt.pivot    = vec2.zero();        // center pivot, so center = visual center

    // 4) Finally set center to that parent anchor point
    effectSt.anchors.setCenter(effectParentPos);

    */
}



async function performSpellAction(spell, gridIndex){
        print("Inside performSpellAction, gridIndex = "+gridIndex);

        print("script.morphActionScript  :"+script.morphActionScript)

        print("script.animHandler :  "+script.animHandler)



    if(spell.type == global.SpellType.Steal){
        print("Animation starting...");
        script.morphActionScript.setPosition(gridIndex);
        var newOwner = (spell.caster == 0) ? global.CellType.User1 : global.CellType.User2;

        await spellActionAnimation(script.morphActioningEffectImage);

        // 1. Determine new owner based on who casted the spell
        
     // 2. Update the data SILENTLY
    // We pass 'true' because we don't want the board to redraw 
    // TWICE (once for owner, once for spell removal). 
    await script.boardController.updateGridData(gridIndex, 'setOwner', newOwner, true);
        
        print("Steal action finalized and spell removed.");

        print("Data updated. owner is now: " + newOwner);

        print("Data updated in background. Now refreshing visuals...");

    }
    else if(spell.type == global.SpellType.Shield){
        script.shieldActionSetPositionScript.setPosition(gridIndex);
        await spellActionAnimation(script.shieldActioningEffectImage);

    }
    else if(spell.type == global.SpellType.Poison){
        print("Inside poison action");
        script.poisonActionSetPositionScript.setPosition(gridIndex);
        await spellActionAnimation(script.poisonActioningEffectImage);
        await script.boardController.updateGridData(gridIndex, 'setOwner', global.CellType.None, true);


    }
    else if(spell.type == global.SpellType.Purifier){
        print("Inside Purifier action");
        //script.poisonActionSetPositionScript.setPosition(gridIndex);
        //await spellActionAnimation(script.poisonActioningEffectImage);
        await script.boardController.updateGridData(gridIndex, 'removeSpell', global.SpellType.Poison, true);
        await script.boardController.updateGridData(gridIndex, 'removeSpell', global.SpellType.Steal, true);

        script.juice.shakeScreen();


    }
    else{
        print("Something wrong to Perform to do Spell Action : "+JSON.stringify(spell));
        return;
    }

    await script.boardController.updateGridData(gridIndex, 'removeSpell', spell.type, true);


    //script.juice.shakeScreen();






    // This code runs only AFTER resolve() is called above
    print("Now executing the code after the await.");
    
    print("SpellManager: performSpellAction SpellAnimation complete.");

    
    // 3. THE REFRESH
    // This will clear the old card, place the new owner's card, 
    // and show any remaining spells for this cell in one clean step.
    // IMPORTANT: Because the owner changed, the card visual needs to swap.
    // We call populateGrid one last time to fix the visuals.
    await script.boardController.populateGrid();
    //script.boardController.needsRepopulate = true;

    print(" action finalized and visuals updated.");


    script.gameover.checkGameEnd();

    script.boardController.updateEndTurnButton();





    }


    async function spellActionAnimation(actionEffectImage){
        await new Promise(function(resolve) {

        print("Animation for action");
        
        // We create an anonymous function to act as the 'onComplete'
        script.animHandler.playVideoAnimation(actionEffectImage, function() {
            

            // 1. Put your custom "onComplete" code here
            print(actionEffectImage + " action Video finished! Now doing custom logic...");
            //script.testImage.getSceneObject().enabled = false; 

            // 2. Call resolve() to tell the 'await' it can continue
            resolve();
        });
});
    script.juice.shakeScreen();

    }





