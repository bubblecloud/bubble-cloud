class Model {

    entities : {[key: string]: Entity} = {}
    mobiles : Entity[] = [];

    onAdd : (entity: Entity) => void;
    onUpdate : (entity: Entity) => void;
    onRemove : (entity: Entity) => void;

    lastTimeMillis: number = (new Date).getTime();

    interpolate() : void {
        var maxInterpolateTimeMillis = 600;
        var timeMillis = (new Date).getTime();
        var timeDeltaMillis : number = timeMillis - this.lastTimeMillis;
        this.lastTimeMillis = timeMillis;
        if (timeDeltaMillis > maxInterpolateTimeMillis) {
            timeDeltaMillis = maxInterpolateTimeMillis;
        }

        this.mobiles.forEach(entity => {

            var position = new BABYLON.Vector3(entity.position.x, entity.position.y, entity.position.z);
            var deltaVector = position.subtract(entity.interpolatedPosition);
            var deltaUnitVector = deltaVector.normalize();
            var deltaLength = deltaVector.length();
            var stepLength = deltaLength * timeDeltaMillis / maxInterpolateTimeMillis;
            var stepVector = deltaUnitVector.scale(stepLength);

            entity.interpolatedPosition = entity.interpolatedPosition.add(stepVector);

            var rotationQuaternion = new BABYLON.Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            entity.interpolatedRotationQuaternion = BABYLON.Quaternion.Slerp(entity.interpolatedRotationQuaternion, rotationQuaternion, timeDeltaMillis / maxInterpolateTimeMillis);

            this.onUpdate(entity);

            //console.log('interpolated:' + JSON.stringify(entity));
        });
    }

    put(entity: Entity) : void {
        var existingEntity = this.entities[entity.id];
        if (existingEntity) {
            Object.getOwnPropertyNames(entity).forEach(name => {
                existingEntity[name] = entity[name];
            });
            if (this.onUpdate) {
                this.onUpdate(existingEntity);
            }
            //console.log(JSON.stringify(entity));
        } else {
            entity.interpolatedPosition = new BABYLON.Vector3(entity.position.x, entity.position.y, entity.position.z);
            entity.interpolatedRotationQuaternion = new BABYLON.Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            this.mobiles.push(entity);
            this.entities[entity.id] = entity;
            if (this.onUpdate) {
                this.onAdd(entity);
            }
        }
    }

    get(entity: Entity) : Entity {
        return this.entities[entity.id];
    }

    remove(entity: Entity) : void {
        delete this.entities[entity.id];
        if (this.onRemove) {
            this.onRemove(entity);
        }
    }

    keys() : string[] {
        return Object.keys(this.entities);
    }

    setOnAdd(onAdd : (entity: Entity) => void) : void {
        this.onAdd = onAdd;
    }

    setOnUpdate(onUpdate : (entity: Entity) => void) : void {
        this.onUpdate = onUpdate;
    }

    setOnRemove(onRemove : (entity: Entity) => void) : void {
        this.onRemove = onRemove;
    }
}