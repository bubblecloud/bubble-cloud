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

    forward(): void {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(0, 0, 1.4 * this.engine.grid.positionStep), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    }

    backward(): void {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(0, 0, - 1.4 * this.engine.grid.positionStep), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    }

    left(): void {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(- 1.4 * this.engine.grid.positionStep, 0, 0), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    }

    right(): void {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(1.4 * this.engine.grid.positionStep, 0, 0), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    }

    up(): void {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(0, 1.4 * this.engine.grid.positionStep, 0), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    }

    down(): void {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(0, - 1.4 * this.engine.grid.positionStep, 0), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    }

}