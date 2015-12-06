import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";

export class EntityAdd {
    engine: ClientEngine;
    addEntityType: string;
    entityTypes: any[] = [
        {type:'primitive', label: 'Primitive'},
        {type:'surface', label: 'Surface'},
        {type:'model', label: 'Model'}
    ];

    constructor() {
        this.engine = getClientEngine();
    }

    addEntity(): void {
        var actuator = this.engine.actuatorRegister.get('default', this.addEntityType);
        var newEntity = actuator.construct();
        newEntity.position = this.engine.avatarController.avatar.position;
        newEntity.rotationQuaternion = this.engine.avatarController.avatar.rotationQuaternion;
        this.engine.ws.sendObject(newEntity);
        this.engine.state.editedEntity = newEntity;
//        alert('add ' + this.addEntityType);
    }

    removeEntity(): void {
        alert('remove');
    }
}