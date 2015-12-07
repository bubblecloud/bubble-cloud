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
            if (eventData.button === 0) {
                var pickResult = this.engine.renderer.scene.pick(this.engine.renderer.scene.pointerX, this.engine.renderer.scene.pointerY);
                var id = pickResult.pickedMesh.name;
                if (this.engine.model.entities[id]) {
                    var entity = this.engine.model.clone(id);
                    //this.engine.ws.sendObject(entity); // Refresh possibly new oid via server to client model.
                    this.engine.state.setEditedEntity(entity);
                }
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