import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";
import Matrix = BABYLON.Matrix;
import Vector3 = BABYLON.Vector3;

export class EntityTranslate {
    engine: ClientEngine;

    constructor() {
        this.engine = getClientEngine();
    }

    translate(translation: Vector3): void {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(translation.scale(this.engine.grid.positionStep * 1.4), rotationMatrix);
            entity.position.copyFrom(this.engine.grid.positionSnap(entity.position.add(stepDirection)));
            this.engine.ws.sendObject(entity);
        }
    }

    forward(): void {
        this.translate(new Vector3(0, 0, 1));
    }

    backward(): void {
        this.translate(new Vector3(0, 0, -1));
    }

    left(): void {
        this.translate(new Vector3(-1, 0, 0));
    }

    right(): void {
        this.translate(new Vector3(1, 0, 0));
    }

    up(): void {
        this.translate(new Vector3(0, 1, 0));
    }

    down(): void {
        this.translate(new Vector3(0, -1, 0));
    }

}