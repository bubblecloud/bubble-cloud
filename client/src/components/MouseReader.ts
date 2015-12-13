import {ClientEngine} from "./ClientEngine";
import {EditorState} from "./EditorState";
import Matrix = BABYLON.Matrix;
import Vector3 = BABYLON.Vector3;

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
                    if (this.engine.state.editorState == EditorState.PARENT_SET) {
                        this.engine.state.editorState = EditorState.NONE;
                        document.body.style.cursor = 'auto';
                        var entity = this.engine.state.getEditedEntity();
                        if (entity) {
                            var parentEntity = this.engine.model.clone(id);

                            // Extract world position of entity according to current parent or absence of parent.
                            var entityWorldPosition: Vector3;
                            if (entity.pid) {
                                var mesh = this.engine.renderer.scene.getMeshByName(entity.pid);
                                var worldMatrix = mesh.getWorldMatrix();
                                var worldMatrixInverted = new Matrix();
                                worldMatrix.invertToRef(worldMatrixInverted);
                                entityWorldPosition = BABYLON.Vector3.TransformCoordinates(entity.position, worldMatrix);
                            } else {
                                entityWorldPosition = entity.position;
                            }

                            entity.pid = parentEntity.id;
                            entity.prid = parentEntity.rid;

                            // Set local position according to new parent.
                            if (entity.pid) {
                                var mesh = this.engine.renderer.scene.getMeshByName(entity.pid);
                                var worldMatrix = mesh.getWorldMatrix();
                                var worldMatrixInverted = new Matrix();
                                worldMatrix.invertToRef(worldMatrixInverted);
                                var entityLocalPosition = BABYLON.Vector3.TransformCoordinates(entityWorldPosition, worldMatrixInverted);
                                entity.position = entityLocalPosition;
                            }

                            this.engine.ws.sendObject(entity);
                            this.engine.state.stateChanged();
                        }
                    } else {
                        var entity = this.engine.model.clone(id);
                        //this.engine.ws.sendObject(entity); // Refresh possibly new oid via server to client model.
                        this.engine.state.setEditedEntity(entity);
                    }
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