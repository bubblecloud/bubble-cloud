var Model = (function () {
    function Model() {
        this.entities = {};
        this.mobiles = [];
        this.lastTimeMillis = (new Date).getTime();
    }
    Model.prototype.interpolate = function () {
        var maxInterpolateTimeMillis = 600;
        var timeMillis = (new Date).getTime();
        var timeDeltaMillis = timeMillis - this.lastTimeMillis;
        this.lastTimeMillis = timeMillis;
        if (timeDeltaMillis > maxInterpolateTimeMillis) {
            timeDeltaMillis = maxInterpolateTimeMillis;
        }
        for (var _i = 0, _a = this.mobiles; _i < _a.length; _i++) {
            var entity = _a[_i];
            var position = new BABYLON.Vector3(entity.position.x, entity.position.y, entity.position.z);
            var deltaVector = position.subtract(entity.interpolatedPosition);
            var deltaLength = deltaVector.length();
            var deltaUnitVector = deltaVector.normalize();
            var stepLength = timeDeltaMillis / maxInterpolateTimeMillis;
            var stepVector = deltaUnitVector.scale(stepLength);
            entity.interpolatedPosition = entity.interpolatedPosition.add(stepVector);
            var rotationQuaternion = new BABYLON.Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            entity.interpolatedRotationQuaternion = BABYLON.Quaternion.Slerp(entity.interpolatedRotationQuaternion, rotationQuaternion, timeDeltaMillis / maxInterpolateTimeMillis);
            entity.interpolatedRotationQuaternion.normalize();
            this.onUpdate(entity);
            if (deltaLength < 0.1) {
                this.mobiles.splice(this.mobiles.indexOf(entity), 1);
            }
        }
    };
    Model.prototype.put = function (entity) {
        var existingEntity = this.entities[entity.id];
        if (existingEntity) {
            Object.getOwnPropertyNames(entity).forEach(function (name) {
                existingEntity[name] = entity[name];
            });
            if (this.onUpdate) {
                this.onUpdate(existingEntity);
            }
            if (this.mobiles.indexOf(existingEntity) < 0) {
                this.mobiles.push(existingEntity);
            }
        }
        else {
            entity.interpolatedPosition = new BABYLON.Vector3(entity.position.x, entity.position.y, entity.position.z);
            entity.interpolatedRotationQuaternion = new BABYLON.Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            this.entities[entity.id] = entity;
            if (this.onUpdate) {
                this.onAdd(entity);
            }
        }
    };
    Model.prototype.get = function (entity) {
        return this.entities[entity.id];
    };
    Model.prototype.remove = function (entity) {
        delete this.entities[entity.id];
        if (this.onRemove) {
            this.onRemove(entity);
        }
    };
    Model.prototype.keys = function () {
        return Object.keys(this.entities);
    };
    Model.prototype.setOnAdd = function (onAdd) {
        this.onAdd = onAdd;
    };
    Model.prototype.setOnUpdate = function (onUpdate) {
        this.onUpdate = onUpdate;
    };
    Model.prototype.setOnRemove = function (onRemove) {
        this.onRemove = onRemove;
    };
    return Model;
})();
