//SpellManager.js

global.SpellType = {
        None : 0,
        Steal   : 1,
        Spell2  : 2,
        Spell3  : 3,
        Spell4 : 4,
        Spell5: 5,
        Spell6: 6
    };


    //@input Component.ScriptComponent turnBased;

//@input Component.ScriptComponent stealOptionKey
//@input Component.ScriptComponent spell1OptionKey
//@input Component.ScriptComponent spell2OptionKey
//@input Component.ScriptComponent spell3OptionKey


//@input Component.ScriptComponent boardController


    var isSpellActivate = false;
    var activatedSpellType = SpellType.None;
    var availableSpell; // = [2,2,2,2,2]   // 0. steal, 1. Spell2, 2. Spell3, 3. Spell4
    var otherPlayerAvailableSpell;
    var currentPlayer;
    var otherPlayer;


    async function turnStarted(){
        currentPlayer = await script.turnBased.getCurrentUserIndex();
        otherPlayer = await script.turnBased.getOtherUserIndex();

        getAvailableSpells(currentPlayer);
        getOtherPlayerAvailableSpells(otherPlayer);

    }

    script.turnStarted = turnStarted;


    async function getAvailableSpells(currentPlayer){
       availableSpell =  await script.turnBased.getUserVariable(currentPlayer, "availableSpells");
       if(availableSpell == undefined){
            availableSpell = [2,2,2,2,2];
       }
       print("available spells of current user : "+ availableSpell);
    }

    async function setAvailableSpells(){
        print("Insid set available spells of current user : "+ availableSpell);

        await script.turnBased.setUserVariable(currentPlayer, "availableSpells", availableSpell);

    }

    async function getOtherPlayerAvailableSpells(otherPlayer){
       otherPlayerAvailableSpell =  await script.turnBased.getUserVariable(otherPlayer, "availableSpells");
       if(otherPlayerAvailableSpell == undefined){
            otherPlayerAvailableSpell = [2,2,2,2,2];
       }
       print("available spells of other user : "+ otherPlayerAvailableSpell);
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

    }




script.activateSpell = activateSpell;


async function spellUsed(spellType){

    if(spellType == global.SpellType.Steal){
        print("Before use steal spell = "+availableSpell[0]);
        availableSpell[0] = availableSpell[0]-1;
        print("After use steal spell = "+availableSpell[0]);


    }



    await setAvailableSpells();

}

script.spellUsed = spellUsed;

function isSpellAvailable(spellType){
    var currentAvailable = 0;
    if(spellType == global.SpellType.Steal){
        currentAvailable = availableSpell[0];
    }
    else if(spellType == global.SpellType.Spell2){
        currentAvailable = availableSpell[1]
    }
    else if(spellType == global.SpellType.Spell3){
        currentAvailable = availableSpell[2]
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
    else if(spellType == SpellType.Spell2){
        script.spell1OptionKey.animateOption();
    }
    else if(spellType == SpellType.Spell3){
        script.spell2OptionKey.animateOption();
    }
    else if(spellType == SpellType.Spell4){
        script.spell3OptionKey.animateOption();
    }
    else{
        print("Something Wrong Occurred To animate Spell Option Keys");
    }

}


function HighlightFunctionalGrids(){

}


// 1. Spell Casted Effects
// 2. Spell Applied Cell Effects
// 3. Spell is working effect



