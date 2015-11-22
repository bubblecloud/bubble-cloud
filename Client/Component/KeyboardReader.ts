class KeyboardInputKeys {
    left:number = 0;
    right:number = 0;
    forward:number = 0;
    back:number = 0;
    up:number = 0;
    down:number = 0;
}

var keyboardKeysPressed = new KeyboardInputKeys();

window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);

function handleKeyDown(evt)
{
    if (evt.keyCode==65){//A
        keyboardKeysPressed.left=1;
    }
    if (evt.keyCode==68){//D
        keyboardKeysPressed.right=1;
    }
    if (evt.keyCode==87){//W
        keyboardKeysPressed.forward=1;
    }
    if (evt.keyCode==83){//S
        keyboardKeysPressed.back=1;
    }
    if (evt.keyCode==69){//E
        keyboardKeysPressed.up=1;
    }
    if (evt.keyCode==81){//Q
        keyboardKeysPressed.down=1;
    }
}

function handleKeyUp(evt)
{
    if (evt.keyCode==65){
        keyboardKeysPressed.left=0;
    }
    if (evt.keyCode==68){
        keyboardKeysPressed.right=0;
    }
    if (evt.keyCode==87){
        keyboardKeysPressed.forward=0;
    }
    if (evt.keyCode==83){
        keyboardKeysPressed.back=0;
    }
    if (evt.keyCode==69){//E
        keyboardKeysPressed.up=0;
    }
    if (evt.keyCode==81){//Q
        keyboardKeysPressed.down=0;
    }
}

class KeyboardReader {
    getPressedKeys() : KeyboardInputKeys {
        return keyboardKeysPressed;
    }
}