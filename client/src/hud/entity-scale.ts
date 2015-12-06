import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";
import Matrix = BABYLON.Matrix;
import Vector3 = BABYLON.Vector3;

export class EntityScale {
    engine: ClientEngine;

    constructor() {
        this.engine = getClientEngine();
    }

    scale(scale: Vector3): void {
        var entity = this.engine.state.getEditedEntity();
        if (entity) {
            entity.scaling.addInPlace(scale.scaleInPlace(this.engine.grid.scaleStep));
            this.engine.state.stateChanged();
            this.engine.ws.sendObject(entity);
        }
    }

    forward(): void {
        this.scale(new Vector3(0, 0, 1));
    }

    backward(): void {
        this.scale(new Vector3(0, 0, -1));
    }

    left(): void {
        this.scale(new Vector3(-1, 0, 0));
    }

    right(): void {
        this.scale(new Vector3(1, 0, 0));
    }

    up(): void {
        this.scale(new Vector3(0, 1, 0));
    }

    down(): void {
        this.scale(new Vector3(0, -1, 0));
    }

}