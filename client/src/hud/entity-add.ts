import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";
import Quaternion = BABYLON.Quaternion;
import Matrix = BABYLON.Matrix;
import Vector3 = BABYLON.Vector3;

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

        var entityWorldPosition = this.engine.avatarController.avatar.position.clone();
        var entityLocalPosition: Vector3;

        var entityWorldRotation = new Matrix();
        this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(entityWorldRotation);
        var entityLocalRotation: Matrix;

        // Set parent if one is selected.
        var parentEntity = this.engine.state.getEditedEntity();
        if  (parentEntity) {
            newEntity.pid = parentEntity.id;
            newEntity.prid = parentEntity.rid;

            var mesh = this.engine.renderer.scene.getMeshByName(newEntity.pid);
            var worldMatrix = mesh.getWorldMatrix();
            var worldMatrixInverted = new Matrix();
            worldMatrix.invertToRef(worldMatrixInverted);
            entityLocalPosition = BABYLON.Vector3.TransformCoordinates(entityWorldPosition, worldMatrixInverted);

            entityLocalRotation = entityWorldRotation.multiply(worldMatrixInverted);
        } else {
            entityLocalPosition = entityWorldPosition;
            entityLocalRotation = entityWorldRotation;
        }

        newEntity.dynamic = false;
        newEntity.position = entityLocalPosition;
        newEntity.rotationQuaternion.fromRotationMatrix(entityLocalRotation);
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