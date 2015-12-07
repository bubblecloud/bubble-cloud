import {ClientEntity} from "./ClientEntity";

import Vector3 = BABYLON.Vector3;
import Matrix = BABYLON.Matrix;
import Quaternion = BABYLON.Quaternion;
import {reserveId} from "./ClientEntity";

export class ClientModel {

    entities : {[key: string]: ClientEntity} = {};
    oidIdMap : {[key: string]: string} = {};
    idOidMap : {[key: string]: string} = {};
    mobiles : ClientEntity[] = [];

    onAdd : (entity: ClientEntity) => void;
    onUpdate : (entity: ClientEntity) => void;
    onRemove : (entity: ClientEntity) => void;

    lastTimeMillis: number = (new Date).getTime();

    interpolate() : void {
        var maxInterpolateTimeMillis = 300;
        var timeMillis = (new Date).getTime();
        var timeDeltaMillis : number = timeMillis - this.lastTimeMillis;
        this.lastTimeMillis = timeMillis;
        if (timeDeltaMillis > maxInterpolateTimeMillis) {
            timeDeltaMillis = maxInterpolateTimeMillis;
        }

        for (var entity of this.mobiles) {

            var rotationQuaternion = new Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            entity.interpolatorRotationQuaternion = Quaternion.Slerp(entity.interpolatorRotationQuaternion, rotationQuaternion, timeDeltaMillis / maxInterpolateTimeMillis);
            entity.interpolatorRotationQuaternion.normalize()
            entity.interpolatedRotationQuaternion = Quaternion.Slerp(entity.interpolatedRotationQuaternion, entity.interpolatorRotationQuaternion, timeDeltaMillis / maxInterpolateTimeMillis);
            entity.interpolatedRotationQuaternion.normalize()

            var position = new Vector3(entity.position.x, entity.position.y, entity.position.z);

            {
                var deltaVector = position.subtract(entity.interpolatorPosition);
                var deltaLength = deltaVector.length();
                var deltaUnitVector = deltaVector.normalize();
                var stepLength = deltaLength * timeDeltaMillis / maxInterpolateTimeMillis;
                var stepVector = deltaUnitVector.scale(stepLength);
                entity.interpolatorPosition = entity.interpolatorPosition.add(stepVector);
            }

            {
                var deltaVector = entity.interpolatorPosition.subtract(entity.interpolatedPosition);
                var deltaLength = deltaVector.length();
                var deltaUnitVector = deltaVector.normalize();
                var stepLength = deltaLength * timeDeltaMillis / maxInterpolateTimeMillis;
                var stepVector = deltaUnitVector.scale(stepLength);
                entity.interpolatedPosition = entity.interpolatedPosition.add(stepVector);
            }

            {
                var deltaVector = position.subtract(entity.interpolatedPosition);
                var deltaLength = deltaVector.length();
                if (deltaLength < 0.005 && entity.interpolatedRotationQuaternion.normalize().subtract(rotationQuaternion.normalize()).length() < 0.005) {
                    entity.interpolatorPosition = position;
                    entity.interpolatedPosition = position;
                    entity.interpolatorRotationQuaternion = rotationQuaternion;
                    entity.interpolatedRotationQuaternion = rotationQuaternion;
                    this.mobiles.splice(this.mobiles.indexOf(entity), 1);
                }
            }

            this.onUpdate(entity);
        }
    }

    /**
     * Copies entity for local editing and handles id mapping.
     * @param id the entity ID
     * @returns {ClientEntity}
     */
    clone(id: string): ClientEntity {
        var localCopy = new ClientEntity();
        var entity = this.entities[id];
        if (!entity.oid) {
            localCopy.oid = entity.id;
            localCopy.newId();
        } else {
            localCopy.oid = entity.id;
            localCopy.id = entity.oid;
        }
        localCopy.core = entity.core;
        localCopy.external = entity.external;
        localCopy.removed = entity.removed;
        localCopy.dynamic = entity.dynamic;
        localCopy.position = new Vector3(entity.position.x, entity.position.y, entity.position.z);
        localCopy.rotationQuaternion = new Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
        localCopy.scaling = new Vector3(entity.scaling.x, entity.scaling.y, entity.scaling.z);
        return localCopy;
    }

    /**
     * Copies properties from identified entity to the target entity.
     * @param sourceEntityId the source entity id
     * @param targetEntity the target entity
     */
    copy(sourceEntityId: string, targetEntity:ClientEntity): ClientEntity {
        var sourceEntity = this.entities[sourceEntityId];
        if (sourceEntity) {
            Object.getOwnPropertyNames(sourceEntity).forEach(name => {
                // Skipping client side parameters.
                if (name.indexOf('interp') == 0) {
                    return;
                }
                targetEntity[name] = sourceEntity[name];
            });
            return targetEntity;
        } else {
            return null;
        }
    }

    put(entity: ClientEntity) : void {
        if (entity.oid && !this.oidIdMap[entity.oid]) {
            this.oidIdMap[entity.oid] = entity.id;
            this.idOidMap[entity.id] = entity.oid;
            reserveId(entity.oid);
        }
        var existingEntity = this.entities[entity.id];
        if (existingEntity) {
            Object.getOwnPropertyNames(entity).forEach(name => {
                existingEntity[name] = entity[name];
            });
            if (this.onUpdate) {
                this.onUpdate(existingEntity);
            }
            /*if (entity.id == '0') {
                console.log('Updating: ' + JSON.stringify(entity));
                console.log('Existing: ' + JSON.stringify(existingEntity));
            }*/
            if (this.mobiles.indexOf(existingEntity) < 0) {
                this.mobiles.push(existingEntity);
            }
        } else {
            entity.interpolatedPosition = new Vector3(entity.position.x, entity.position.y, entity.position.z);
            entity.interpolatorPosition = new Vector3(entity.position.x, entity.position.y, entity.position.z);
            entity.interpolatedRotationQuaternion = new Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            entity.interpolatorRotationQuaternion = new Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            this.entities[entity.id] = entity;
            if (this.onUpdate) {
                this.onAdd(entity);
            }
        }

    }

    get(entity: ClientEntity) : ClientEntity {
        return this.entities[entity.id];
    }

    remove(entity: ClientEntity) : void {
        delete this.entities[entity.id];
        if (entity.oid) {
            delete this.oidIdMap[entity.oid];
            delete this.idOidMap[entity.id];
        }
        if (this.onRemove) {
            this.onRemove(entity);
        }
    }

    keys() : string[] {
        return Object.keys(this.entities);
    }

    setOnAdd(onAdd : (entity: ClientEntity) => void) : void {
        this.onAdd = onAdd;
    }

    setOnUpdate(onUpdate : (entity: ClientEntity) => void) : void {
        this.onUpdate = onUpdate;
    }

    setOnRemove(onRemove : (entity: ClientEntity) => void) : void {
        this.onRemove = onRemove;
    }
}