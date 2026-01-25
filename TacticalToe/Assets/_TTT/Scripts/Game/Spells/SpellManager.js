global.SpellType = {
        None : 0,
        Steal   : 1,
        Spell2  : 2,
        Spell3  : 3,
        Spell4 : 4,
        Spell5: 5,
        Spell6: 6
    };

//@input Component.ScriptComponent stealOptionKey
//@input Component.ScriptComponent spell1OptionKey
//@input Component.ScriptComponent spell2OptionKey
//@input Component.ScriptComponent spell3OptionKey


    var isSpellActivate = false;
    var activatedSpellType = SpellType.None;
    var availableSpell = []   // 0. steal, 1. Spell2, 2. Spell3, 3. Spell4



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


                animateOptionKeys(activatedSpellType);
                print("Should be down the current activated option");

                activatedSpellType = SpellType.None;
                print("Activated Spell Set to NONE");


                // TODO : Need to change animation of Option Key
            }

            // Change Activated Spell
            else{
                animateOptionKeys(activatedSpellType)
                activatedSpellType = spellType;
                animateOptionKeys(activatedSpellType)

                // TODO : Need to change animation of Option Key

            }

        }

        else{
            print("Inside Spell activated is false");

            isSpellActivate = true;
            activatedSpellType = spellType;
            animateOptionKeys(activatedSpellType)

            // TODO : Need to change animation of Option Key

        }

    }




script.activateSpell = activateSpell;


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



