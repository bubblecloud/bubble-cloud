import {ClientEngine} from "./ClientEngine";

export class MouseReader {

    engine: ClientEngine;

    mouseLook: boolean = false;
    movementX: number = 0;
    movementY: number = 0;

    constructor(engine: ClientEngine) {
        this.engine = engine;
        document.getElementById("renderCanvas").onmousedown = (eventData) => {
            if (eventData.button === 2) {
                document.getElementById("renderCanvas").requestPointerLock();
                this.mouseLook = true;
            }
        }

        document.getElementById("renderCanvas").onmouseup = (eventData) =>  {
            if (eventData.button === 2) {
                document.exitPointerLock();
                this.mouseLook = false;
            }
        }

        document.getElementById("renderCanvas").onmousemove = (event) => {
            if (this.mouseLook) {
                this.movementX += event.movementX;
                this.movementY += event.movementY;
            }
        }
    }

    popMovementX() : number {
        var x = this.movementX;
        this.movementX = 0;
        return x;
    }

    popMovementY() : number {
        var y = this.movementY;
        this.movementY = 0;
        return y;
    }

}