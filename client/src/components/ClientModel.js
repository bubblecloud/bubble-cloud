var ClientEntity_1 = require("./ClientEntity");
var Vector3 = BABYLON.Vector3;
var Quaternion = BABYLON.Quaternion;
var IdRegister_1 = require("./IdRegister");
var ClientModel = (function () {
    function ClientModel() {
        this.idRegister = new IdRegister_1.IdRegister();
        this.entities = {};
        this.oidIdMap = {};
        this.idOidMap = {};
        this.mobiles = [];
        this.lastTimeMillis = (new Date).getTime();
    }
    ClientModel.prototype.interpolate = function () {
        var maxInterpolateTimeMillis = 300;
        var timeMillis = (new Date).getTime();
        var timeDeltaMillis = timeMillis - this.lastTimeMillis;
        this.lastTimeMillis = timeMillis;
        if (timeDeltaMillis > maxInterpolateTimeMillis) {
            timeDeltaMillis = maxInterpolateTimeMillis;
        }
        for (var _i = 0, _a = this.mobiles; _i < _a.length; _i++) {
            var entity = _a[_i];
            var rotationQuaternion = new Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            entity.interpolatorRotationQuaternion = Quaternion.Slerp(entity.interpolatorRotationQuaternion, rotationQuaternion, timeDeltaMillis / maxInterpolateTimeMillis);
            entity.interpolatorRotationQuaternion.normalize();
            entity.interpolatedRotationQuaternion = Quaternion.Slerp(entity.interpolatedRotationQuaternion, entity.interpolatorRotationQuaternion, timeDeltaMillis / maxInterpolateTimeMillis);
            entity.interpolatedRotationQuaternion.normalize();
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
    };
    ClientModel.prototype.clone = function (id) {
        var localCopy = new ClientEntity_1.ClientEntity();
        var entity = this.entities[id];
        localCopy.oid = entity.id;
        localCopy.id = entity.oid;
        localCopy.poid = entity.pid;
        localCopy.pid = entity.poid;
        localCopy.name = entity.name;
        localCopy.type = entity.type;
        localCopy.core = entity.core;
        localCopy.external = entity.external;
        localCopy.removed = entity.removed;
        localCopy.dynamic = entity.dynamic;
        localCopy.position = new Vector3(entity.position.x, entity.position.y, entity.position.z);
        localCopy.rotationQuaternion = new Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
        localCopy.scaling = new Vector3(entity.scaling.x, entity.scaling.y, entity.scaling.z);
        return localCopy;
    };
    ClientModel.prototype.copy = function (sourceEntityId, targetEntity) {
        var sourceEntity = this.entities[sourceEntityId];
        if (sourceEntity) {
            Object.getOwnPropertyNames(sourceEntity).forEach(function (name) {
                if (name.indexOf('interp') == 0) {
                    return;
                }
                targetEntity[name] = sourceEntity[name];
            });
            return targetEntity;
        }
        else {
            return null;
        }
    };
    ClientModel.prototype.put = function (entity) {
        /*if (entity.oid && !this.oidIdMap[entity.oid]) {
            this.oidIdMap[entity.oid] = entity.id;
            this.idOidMap[entity.id] = entity.oid;
            this.idRegister.reserveId(entity.oid);
        }
        if (entity.poid && !this.oidIdMap[entity.poid]) {
            this.oidIdMap[entity.poid] = entity.pid;
            this.idOidMap[entity.pid] = entity.poid;
            this.idRegister.reserveId(entity.poid);
        }*/
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
            entity.interpolatedPosition = new Vector3(entity.position.x, entity.position.y, entity.position.z);
            entity.interpolatorPosition = new Vector3(entity.position.x, entity.position.y, entity.position.z);
            entity.interpolatedRotationQuaternion = new Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            entity.interpolatorRotationQuaternion = new Quaternion(entity.rotationQuaternion.x, entity.rotationQuaternion.y, entity.rotationQuaternion.z, entity.rotationQuaternion.w);
            this.entities[entity.id] = entity;
            if (this.onUpdate) {
                this.onAdd(entity);
            }
        }
    };
    ClientModel.prototype.get = function (entity) {
        return this.entities[entity.id];
    };
    ClientModel.prototype.remove = function (entity) {
        delete this.entities[entity.id];
        if (entity.oid) {
            delete this.oidIdMap[entity.oid];
            delete this.idOidMap[entity.id];
        }
        if (this.onRemove) {
            this.onRemove(entity);
        }
    };
    ClientModel.prototype.keys = function () {
        return Object.keys(this.entities);
    };
    ClientModel.prototype.setOnAdd = function (onAdd) {
        this.onAdd = onAdd;
    };
    ClientModel.prototype.setOnUpdate = function (onUpdate) {
        this.onUpdate = onUpdate;
    };
    ClientModel.prototype.setOnRemove = function (onRemove) {
        this.onRemove = onRemove;
    };
    return ClientModel;
})();
exports.ClientModel = ClientModel;
