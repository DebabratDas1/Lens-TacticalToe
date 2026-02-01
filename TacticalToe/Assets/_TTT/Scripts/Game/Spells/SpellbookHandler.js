//@input SceneObject spellBook
//@input Component.Image spellImage
//@input Component.Text spellName
//@input Component.Text spellDetails


//@input Asset.Texture morphCardTexture
//@input Asset.Texture shieldCardTexture
//@input Asset.Texture poisonCardTexture
//@input Asset.Texture spell4CardTexture
//@input Asset.Texture defaultCardTexture


//@input string morphCardName
//@input string shieldCardName 
//@input string poisonCardName 
//@input string spell4CardName 


//@input string morphCardDetails
//@input string shieldCardDetails
//@input string poisonCardDetails
//@input string spell4CardDetails


var mat = script.spellImage.mainMaterial.clone();
script.spellImage.mainMaterial = mat;



function showSpellbook(spellType){
    var cardTexture = script.defaultCardTexture;
    var cardName    = "";
    var cardDetails = "";




    switch (spellType) {
        case global.SpellType.None:
            disableSpellBook();
            break;

        case global.SpellType.Steal:
            // Handle Steal spell
            cardTexture = script.morphCardTexture;
            cardName = script.morphCardName;
            print("morphCardName : "+script.morphCardName);
            cardDetails = script.morphCardDetails;
            print("morphCardName : "+script.morphCardDetails);

            enableSpellBook();

            break;

        case global.SpellType.Shield:


            // Handle Spell2

            cardTexture = script.shieldCardTexture;
            cardName = script.shieldCardName;
            print("SHIELDCardName : "+script.shieldCardName);
            cardDetails = script.shieldCardDetails;
            print("SHIELDCardDetails : "+script.shieldCardDetails);

            enableSpellBook();
            break;

        case global.SpellType.Poison:
            // Handle Spell3

            cardTexture = script.poisonCardTexture;
            cardName = script.poisonCardName;
            print("PoisonCardName : "+script.poisonCardName);
            cardDetails = script.poisonCardDetails;
            print("PoisonCardDetails : "+script.poisonCardDetails);

            enableSpellBook();
            break;

        case global.SpellType.Spell4:
            // Handle Spell4
            break;

        case global.SpellType.Spell5:
            // Handle Spell5
            break;

        case global.SpellType.Spell6:
            // Handle Spell6
            break;

        default:
            disableSpellBook();
            print("Unknown spell type: " + spellType);
            break;
    }

    
    mat.mainPass.baseTex = cardTexture;
    script.spellName.text = cardName;
    script.spellDetails.text = cardDetails;




}

script.showSpellbook = showSpellbook;

function enableSpellBook(){
    print("Enable Spell Book");
    global.tweenManager.startTween(script.spellBook, "SpellBookShow");
}

function disableSpellBook(){
    print("Disable Spell Book");
    global.tweenManager.startTween(script.spellBook, "SpellBookHide");
}




