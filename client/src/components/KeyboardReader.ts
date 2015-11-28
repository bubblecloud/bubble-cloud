import {ClientEngine} from "./ClientEngine";
class KeyboardInputKeys {
    left:number = 0;
    right:number = 0;
    forward:number = 0;
    back:number = 0;
    up:number = 0;
    down:number = 0;
}


export class KeyboardReader {
    engine: ClientEngine;
    keyboardKeysPressed = new KeyboardInputKeys();

    constructor(engine: ClientEngine) {
        this.engine = engine;

        window.addEventListener("keydown",(evt) => {
            this.handleKeyDown(evt);
        }, false);
        window.addEventListener("keyup",(evt) => {
            this.handleKeyUp(evt);
        }, false);

    }

    getPressedKeys() : KeyboardInputKeys {
        return this.keyboardKeysPressed;
    }

    handleKeyDown(evt) {
        if (evt.keyCode==65){//A
            this.keyboardKeysPressed.left=1;
        }
        if (evt.keyCode==68){//D
            this.keyboardKeysPressed.right=1;
        }
        if (evt.keyCode==87){//W
            this.keyboardKeysPressed.forward=1;
        }
        if (evt.keyCode==83){//S
            this.keyboardKeysPressed.back=1;
        }
        if (evt.keyCode==69){//E
            this.keyboardKeysPressed.up=1;
        }
        if (evt.keyCode==81){//Q
            this.keyboardKeysPressed.down=1;
        }
    }

    handleKeyUp(evt) {
        if (evt.keyCode==65){
            this.keyboardKeysPressed.left=0;
        }
        if (evt.keyCode==68){
            this.keyboardKeysPressed.right=0;
        }
        if (evt.keyCode==87){
            this.keyboardKeysPressed.forward=0;
        }
        if (evt.keyCode==83){
            this.keyboardKeysPressed.back=0;
        }
        if (evt.keyCode==69){//E
            this.keyboardKeysPressed.up=0;
        }
        if (evt.keyCode==81){//Q
            this.keyboardKeysPressed.down=0;
        }
        if (evt.keyCode==27){// ESC
            this.engine.state.hudVisible = !this.engine.state.hudVisible;
        }
    }

}