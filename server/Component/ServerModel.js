var ServerModel = (function () {
    function ServerModel() {
        this.entities = {};
    }
    ServerModel.prototype.put = function (entity) {
        var existingEntity = this.entities[entity.id];
        if (entity.removed) {
            if (existingEntity) {
                this.remove(entity);
            }
            return;
        }
        if (existingEntity) {
            Object.getOwnPropertyNames(entity).forEach(function (name) {
                existingEntity[name] = entity[name];
            });
            if (this.onUpdate) {
                this.onUpdate(existingEntity);
            }
        }
        else {
            this.entities[entity.id] = entity;
            if (this.onUpdate) {
                this.onAdd(entity);
            }
        }
    };
    ServerModel.prototype.get = function (id) {
        return this.entities[id];
    };
    ServerModel.prototype.remove = function (entity) {
        delete this.entities[entity.id];
        if (this.onRemove) {
            this.onRemove(entity);
        }
    };
    ServerModel.prototype.keys = function () {
        return Object.keys(this.entities);
    };
    ServerModel.prototype.setOnAdd = function (onAdd) {
        this.onAdd = onAdd;
    };
    ServerModel.prototype.setOnUpdate = function (onUpdate) {
        this.onUpdate = onUpdate;
    };
    ServerModel.prototype.setOnRemove = function (onRemove) {
        this.onRemove = onRemove;
    };
    return ServerModel;
})();
exports.ServerModel = ServerModel;
