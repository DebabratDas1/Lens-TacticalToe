//MorphCastEffect.js

//@input vec4[] positions;
//@input Component.ScreenTransform thisScreenTransform;



function setPosition(index){
    print("Inside set position");
    //script.thisScreenTransform.anchors.setCenter(script.positions[index]);

    var a = script.thisScreenTransform.anchors;
a.left   = script.positions[index].x;
a.right  =  script.positions[index].y;
a.bottom = script.positions[index].z;
a.top    =  script.positions[index].w;
script.thisScreenTransform.anchors = a;

}

script.setPosition = setPosition