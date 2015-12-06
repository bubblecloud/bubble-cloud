import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";
import Matrix = BABYLON.Matrix;
import Vector3 = BABYLON.Vector3;
import {ClientState} from "../components/ClientState";
import {ClientStateListener} from "../components/ClientStateListener";
import {ClientEntity} from "../components/ClientEntity";

export class EntityProperties implements ClientStateListener {

    engine: ClientEngine;
    state: ClientState;
    entity: ClientEntity;
    position: Vector3;
    rotation: Vector3;
    scaling: Vector3;

    constructor() {
        this.engine = getClientEngine();
        this.state = this.engine.state;
        this.state.addClientStateListener(this);
    }

    stateChange(): void {
        this.entity = this.state.getEditedEntity();
        if (this.entity) {
            this.position = this.entity.position.clone();
            this.rotation = this.entity.rotationQuaternion.toEulerAngles();
            this.scaling = this.entity.scaling.clone();
        } else {
            this.position = null;
            this.rotation = null;
            this.scaling = null;
        }
    }
}