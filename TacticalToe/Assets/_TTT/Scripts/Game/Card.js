//Card.js

//@input Component.ScriptComponent turnBasedPlayerInfo




async function setTargetUser(targetUser) {

    print("Inside SetTragetUser");
    if (!script.turnBasedPlayerInfo) {
        print("TurnBasedPlayerInfo not set");
        return;
    }

    print(script.turnBasedPlayerInfo.turnBased);
    print("Trarget user : "+targetUser);

    const user = await script.turnBasedPlayerInfo.turnBased.getUser(targetUser); // 0 or 1
    await script.turnBasedPlayerInfo.setSnapchatUser(user);

    const currentTarget = await script.turnBasedPlayerInfo.getTargetUser();
    print("script.turnBasedPlayerInfo.userType  :  "+currentTarget);
}

script.setTargetUser = setTargetUser;

function onTouchEnd(eventData) {
    print(script.getSceneObject().getComponent("Component.ScreenTransform").anchors.getCenter())
}

script.createEvent("TouchEndEvent").bind(onTouchEnd);


function getName(){
    return script.getSceneObject().name;
}

script.getName = getName;