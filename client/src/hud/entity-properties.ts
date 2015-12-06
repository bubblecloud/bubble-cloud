import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";
import Matrix = BABYLON.Matrix;
import Vector3 = BABYLON.Vector3;
import {ClientState} from "../components/ClientState";
import {ClientStateListener} from "../components/ClientStateListener";
import {ClientEntity} from "../components/ClientEntity";
import Quaternion = BABYLON.Quaternion;

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
        var editedEntity = this.state.getEditedEntity();
        if (editedEntity && this.engine.model.oidIdMap[editedEntity.id]) {
            var id = this.engine.model.oidIdMap[editedEntity.id];
            this.entity = this.engine.model.entities[id];
            this.position = new Vector3(this.entity.position.x, this.entity.position.y, this.entity.position.z);
            var rotationQuaternion = new Quaternion();
            rotationQuaternion.copyFrom(this.entity.rotationQuaternion);
            this.rotation = rotationQuaternion.toEulerAngles();
            this.rotation.scaleInPlace(180 / Math.PI);
            this.scaling =  new Vector3(this.entity.scaling.x, this.entity.scaling.y, this.entity.scaling.z);
        } else {
            this.position = null;
            this.rotation = null;
            this.scaling = null;
        }
    }
}