

//@input  Component.Text opponentMorphAvailNo
//@input  Component.Text opponentShieldAvailNo
//@input  Component.Text opponentPoisonAvailNo
//@input  Component.Text opponentPurifierAvailNo

//@input SceneObject opponentUi;


function setOpponentSpellNos(opponentAvailableSpells){


    if(script.opponentMorphAvailNo)script.opponentMorphAvailNo.text = opponentAvailableSpells[0].toString();
    if(script.opponentShieldAvailNo)script.opponentShieldAvailNo.text = opponentAvailableSpells[1].toString();
    if(script.opponentPoisonAvailNo)script.opponentPoisonAvailNo.text = opponentAvailableSpells[2].toString();
    if(script.opponentPurifierAvailNo)script.opponentPurifierAvailNo.text = opponentAvailableSpells[3].toString();


    if(script.opponentUi)script.opponentUi.enabled = true;



}

script.setOpponentSpellNos = setOpponentSpellNos;



