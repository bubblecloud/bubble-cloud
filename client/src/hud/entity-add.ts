import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";
import Quaternion = BABYLON.Quaternion;

export class EntityAdd {
    engine:ClientEngine;
    addEntityType:string;
    entityTypes:any[] = [
        {type: 'surface', label: 'Surface'},
        {type: 'primitive', label: 'Primitive'},
        {type: 'model', label: 'Model'}
    ];

    constructor() {
        this.engine = getClientEngine();
    }

    addEntity(): void {
        var actuator = this.engine.actuatorRegister.get('default', this.addEntityType);
        var newEntity = actuator.construct(this.engine);

        // Set parent if one is selected.
        var parentEntity = this.engine.state.getEditedEntity();
        if  (parentEntity) {
            newEntity.pid = parentEntity.id;
            newEntity.prid = parentEntity.rid;
        }

        newEntity.dynamic = false;
        newEntity.position = this.engine.avatarController.avatar.position.clone();
        newEntity.rotationQuaternion = this.engine.avatarController.avatar.rotationQuaternion.clone();
        this.engine.ws.sendObject(newEntity);
        this.engine.state.setEditedEntity(newEntity);
//        alert('add ' + this.addEntityType);
    }

    removeEntity(): void {
        var entity = this.engine.state.getEditedEntity();
        if (entity) {
            entity.removed = true;
            this.engine.ws.sendObject(entity);
        }
    }

    deselectEntity(): void {
        this.engine.state.setEditedEntity(null);
    }
}